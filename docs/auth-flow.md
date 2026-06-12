# Authentication & Authorization Flow

## Architecture Overview

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│   Browser    │ ───> │    Nginx     │ ───> │  ASP.NET BFF     │
│  (SPA: Vite) │      │  (port 8080) │      │  (port 5005)     │
└──────────────┘      └──────────────┘      └───────┬──────────┘
      │                                              │
      │                                    ┌─────────▼──────────┐
      └────────────────────────────────────┤  Auth0 (OIDC)      │
                                           │  (identity provider)│
                                           └────────────────────┘
```

The SPA (React/Vite) is served as a static site by Nginx. API calls under `/api/` are proxied to the ASP.NET BFF. The BFF handles all OIDC interactions with Auth0. The browser only ever receives a session cookie (`.Filo.Auth`). Tokens (access, refresh) live exclusively on the server.

---

## Authentication Flow (Step by Step)

### 1. User Visits the App

1. Browser requests `localhost:8080`
2. Nginx serves `index.html` (SPA) for any non-`/api/` route
3. SPA loads, `AuthGuard` checks auth state
4. No valid session → redirects to `/api/auth/login`

### 2. Login Initiation (Server)

```
SPA ──> GET /api/auth/login ──> AuthController.Login()
                                  │
                                  ▼
                          Challenge(OpenIdConnect)
                                  │
                                  ▼
                       OIDC handler builds Auth0 URL:
                       https://{domain}.auth0.com/authorize?
                         client_id=...&
                         redirect_uri=/api/auth/callback&
                         response_type=code&
                         scope=openid+profile+email+offline_access&
                         ...
                                  │
                                  ▼
                          302 Redirect to Auth0
```

- `AuthController.Login()` calls `Challenge(OpenIdConnectDefaults.AuthenticationScheme)`
- ASP.NET's OpenIdConnect handler constructs the Auth0 authorization URL
- The browser is redirected to Auth0's hosted login page

### 3. User Logs in at Auth0

- User enters credentials (or Auth0 SSO auto-redirects)
- Auth0 authenticates and issues an authorization code
- Auth0 redirects the browser to `http://localhost:8080/api/auth/callback?code=...`

### 4. Code Exchange (Callback)

```
Browser ──> GET /api/auth/callback?code=... ──> Nginx ──> ASP.NET
                                                           │
                                                           ▼
                                               OIDC handler intercepts callback
                                                           │
                                                           ▼
                                               Exchanges code for tokens:
                                               - Access token
                                               - Refresh token
                                               - ID token
                                                           │
                                                           ▼
                                               OnTokenValidated event fires
```

### 5. OnTokenValidated (Session Creation)

In `OpenIdConnectConfigureOptions.cs`:

1. Extracts the `sub` claim (Auth0 user ID, e.g. `auth0|6a2bf7fe83cf857b40d9585d`)
2. Creates a `UserSession`:
   - `SessionId`: new GUID
   - `UserId`: parsed from `sub` (could be `Guid.Empty` for Auth0 IDs)
   - `AccessToken`, `RefreshToken`: from token response
   - `TokenExpiresAt`: from `expires_in`
   - `IpAddress`, `UserAgent`: from request
   - `CreatedAt`: now
   - `ExpiresAt`: now + 7 days
3. Stores session via `ISessionStore.CreateSessionAsync()`
4. Adds `session_id` claim to the principal

### 6. Cookie Issuance

After the OIDC handler succeeds, ASP.NET's cookie authentication:

1. Serializes the `ClaimsPrincipal` (including the `session_id` claim) into an `AuthenticationTicket`
2. Stores the ticket in `InMemoryTicketStore` (server-side), keyed by a random string
3. Issues the `.Filo.Auth` cookie containing only the ticket key (not the actual claims)
4. Redirects the browser to the original `returnUrl` (or `/`)

### 7. Subsequent Requests

```
SPA ──> GET /api/auth/me ──> Nginx ──> ASP.NET
                                          │
                                          ▼
                              Cookie middleware reads .Filo.Auth cookie
                                          │
                                          ▼
                              OnValidatePrincipal fires:
                              1. Reads session_id claim from ticket
                              2. Loads UserSession from ISessionStore
                              3. If token expires soon → refresh via Auth0TokenRefresher
                              4. If session invalid → RejectPrincipal() → 401
                                          │
                                          ▼
                              CustomClaimsTransformation:
                              1. Reads sub claim
                              2. Calls GetUserPermissionQuery via MediatR
                              3. Adds permission claims from DB
                                          │
                                          ▼
                              AuthController.Me():
                              1. Reads sub claim
                              2. Calls GetCurrentUserQuery via MediatR
                              3. Returns CurrentUserResponse (with roles + permissions)
```

---

## Class-by-Class Reference

### Configuration Layer

#### `Auth0Options` (`src/Filo.Infrastructure/Configuration/Auth0Options.cs`)

POCO holding all Auth0 configuration: `Domain`, `BffClientId`, `BffClientSecret`, `ManagementClientId`, `ManagementClientSecret`, `Audience`. Bound from the `"Auth0"` config section.

#### `Auth0OptionsSetup` (`src/Filo.Infrastructure/Configuration/Auth0OptionsSetup.cs`)

Implements `IConfigureOptions<Auth0Options>`. Reads the `"Auth0"` section from `IConfiguration` and binds to `Auth0Options`. Registered via `ConfigureOptions<Auth0OptionsSetup>()`.

#### `Auth0OptionsValidator` (`src/Filo.Infrastructure/Configuration/Auth0OptionsValidator.cs`)

Implements `IValidateOptions<Auth0Options>`. Validates all required fields are non-empty. Registered with `ValidateOnStart()` so the app fails fast at startup if Auth0 config is incomplete.

---

### Authentication Pipeline

#### `AuthenticationExtension` (`src/Filo.Infrastructure/Common/Authentication/AuthenticationExtension.cs`)

Orchestrates all auth-related DI registrations:
- Registers `InMemoryTicketStore` (singleton) — ASP.NET Core's `ITicketStore`
- Registers `InMemorySessionStore` (singleton) — custom `ISessionStore`
- Registers `Auth0TokenRefresher` via `AddHttpClient`
- Registers configure options classes for cookie, OIDC, and JWT bearer
- Calls `AddAuthentication(Cookies)` → `AddCookie()` → `AddOpenIdConnect()` → `AddJwtBearer()`

The order matters: cookie is the default scheme, OIDC is for login/logout, JWT bearer is for machine-to-machine clients.

#### `OpenIdConnectConfigureOptions` (`src/Filo.Infrastructure/Common/Authentication/OpenIdConnectConfigureOptions.cs`)

Configures `OpenIdConnectOptions` for Auth0:

| Setting | Value | Purpose |
|---------|-------|---------|
| `Authority` | `https://{Domain}` | Auth0 tenant URL |
| `ClientId` / `ClientSecret` | `BffClientId/Secret` | BFF app credentials |
| `ResponseType` | `code` | Authorization Code Flow |
| `UsePkce` | `true` | PKCE for additional security |
| `CallbackPath` | `/api/auth/callback` | Where Auth0 redirects after login |
| `Scopes` | `openid profile email offline_access` | `offline_access` is critical for refresh tokens |

**Events:**

| Event | Purpose |
|-------|---------|
| `OnRedirectToIdentityProvider` | Logs redirect URI and cookie settings for debugging |
| `OnRemoteFailure` | Logs OIDC errors with cookie dump for debugging |
| `OnTokenValidated` | **Core session creation**: extracts `sub`, creates `UserSession`, persists via `ISessionStore`, adds `session_id` claim |

#### `CookieConfigureOptions` (`src/Filo.Infrastructure/Common/Authentication/CookieConfigureOptions.cs`)

Configures `CookieAuthenticationOptions` for the `.Filo.Auth` cookie:

| Setting | Value | Purpose |
|---------|-------|---------|
| `Cookie.Name` | `.Filo.Auth` | Auth cookie name |
| `Cookie.HttpOnly` | `true` | Prevents XSS access |
| `Cookie.SameSite` | `Unspecified` | Required for OIDC redirect flow over HTTP |
| `ExpireTimeSpan` | 7 days | Session lifetime |
| `SlidingExpiration` | `true` | Extends cookie on each request within the window |

**`OnValidatePrincipal` (the critical event):**

This runs on every authenticated request. It's the heart of the BFF session management:

```
Request comes in with .Filo.Auth cookie
         │
         ▼
Read session_id claim
         │
         ▼
Load UserSession from ISessionStore
         │
         ├── Session null/expired → RejectPrincipal() → 401
         │
         ▼
Check TokenExpiresAt
         │
         ├── Still valid (>5min left) → OK, continue
         │
         └── Expiring soon (within 5min) → Refresh via Auth0TokenRefresher
                    │
                    ├── Success → Update session tokens + renew cookie
                    │
                    └── Fail → Revoke session + RejectPrincipal()
```

#### `JwtBearerConfigureOptions` (`src/Filo.Infrastructure/Common/Authentication/JwtBearerConfigureOptions.cs`)

Configures `JwtBearerOptions` for machine-to-machine scenarios:
- `Authority`: Auth0 domain
- `Audience`: the configured API audience
- `NameClaimType`: `ClaimTypes.NameIdentifier`

This allows non-browser clients (mobile apps, other services) to authenticate directly with a JWT bearer token.

---

### Session Store Layer

#### `ISessionStore` (`src/Filo.Infrastructure/Session/ISessionStore.cs`)

Interface for BFF session persistence:

```csharp
Task<UserSession> CreateSessionAsync(UserSession session, ...);
Task<UserSession?> GetSessionAsync(Guid sessionId, ...);
Task UpdateSessionTokensAsync(Guid sessionId, string accessToken, string refreshToken, DateTimeOffset expiresAt, ...);
Task RevokeSessionAsync(Guid sessionId, ...);
Task RevokeAllUserSessionsAsync(Guid userId, ...);
Task<IReadOnlyList<UserSession>> GetUserSessionsAsync(Guid userId, ...);
```

#### `InMemorySessionStore` (`src/Filo.Infrastructure/Session/InMemorySessionStore.cs`)

Implements `ISessionStore` using `ConcurrentDictionary<Guid, UserSession>`. **Not durable** — sessions are lost on restart. Ready to swap with Redis/SQL implementation.

#### `UserSession` (`src/Filo.Infrastructure/Session/UserSession.cs`)

| Field | Type | Purpose |
|-------|------|---------|
| `SessionId` | `Guid` | Unique session identifier |
| `UserId` | `Guid` | App-level user ID |
| `AccessToken` | `string?` | Auth0 access token |
| `RefreshToken` | `string?` | Auth0 refresh token |
| `TokenExpiresAt` | `DateTimeOffset?` | When tokens expire |
| `IpAddress` | `string?` | Client IP at creation |
| `UserAgent` | `string?` | Client UA at creation |
| `CreatedAt` | `DateTimeOffset` | Session creation time |
| `ExpiresAt` | `DateTimeOffset` | Session expiry (7 days) |

#### `InMemoryTicketStore` (`src/Filo.Infrastructure/Session/InMemoryTicketStore.cs`)

Implements ASP.NET Core's `ITicketStore`. Stores `AuthenticationTicket` objects server-side. The `.Filo.Auth` cookie only contains a ticket key (random GUID string), not the actual claims/session. This enables server-side session revocation.

**Why both a `TicketStore` and a `SessionStore`?**
- `ITicketStore` is ASP.NET Core's built-in mechanism for server-side ticket storage. It stores the `AuthenticationTicket` (which contains the `ClaimsPrincipal` and authentication properties). The cookie holds a key that maps to this ticket.
- `ISessionStore` is our custom store for BFF session data (tokens, etc.). It's separate because the ticket store doesn't expose the token data we need for the BFF pattern.

---

### Token Lifecycle

#### `Auth0TokenRefresher` (`src/Filo.Infrastructure/Common/Authentication/Auth0TokenRefresher.cs`)

Calls Auth0's `/oauth/token` endpoint with `grant_type=refresh_token` to exchange a refresh token for new tokens.

**Why server-side?** The BFF pattern requires all token operations to happen server-side. Refresh tokens never reach the browser. This prevents token theft via XSS.

Called by `CookieConfigureOptions.OnValidatePrincipal` when the access token is about to expire.

---

### Claims & Authorization

#### `CustomClaimsTransformation` (`src/Filo.Infrastructure/Common/Authorization/CustomClaimsTransformation.cs`)

Implements `IClaimsTransformation`. On every authenticated request:

1. Extracts `sub` claim from the principal
2. Calls `GetUserPermissionQuery` via MediatR → fetches permissions from DB
3. Adds each permission as a claim of type `"permission"` to a new identity

The transformed principal is cached by ASP.NET Core for the lifetime of the request, so subsequent authorization checks don't need to hit the database.

#### `CustomClaims` (`src/Filo.Infrastructure/Common/Authentication/CustomClaims.cs`)

Constants for custom claim types used across the codebase:
- `Sub = "sub"` — Auth0 user ID
- `Permission = "permission"` — Permission codes from DB
- `SessionId = "session_id"` — BFF session ID

#### `PermissionRequirement` (`src/Filo.Infrastructure/Common/Authorization/PermissionRequirement.cs`)

An `IAuthorizationRequirement` that holds a single permission name (e.g., `"file:download"`).

#### `PermissionAuthorizationHandler` (`src/Filo.Infrastructure/Common/Authorization/PermissionAuthorizationHandler.cs`)

`AuthorizationHandler<PermissionRequirement>`. Checks if the principal has a claim of type `"permission"` matching the requirement's permission value.

#### `PermissionAuthorizationPolicyProvider` (`src/Filo.Infrastructure/Common/Authorization/PermissionAuthorizationPolicyProvider.cs`)

Extends `DefaultAuthorizationPolicyProvider`. When `GetPolicyAsync` is called with a policy name that doesn't match a named policy, it dynamically creates one with a `PermissionRequirement(policyName)`.

This enables attribute-based permission checks like `[Authorize(Policy = "file:download")]`.

#### `AuthorizationExtension` (`src/Filo.Infrastructure/Common/Authorization/AuthorizationExtension.cs`)

Registers:
- `CustomClaimsTransformation` (scoped via `IClaimsTransformation`)
- `PermissionAuthorizationHandler` (singleton)
- `PermissionAuthorizationPolicyProvider` (singleton)

---

### API Layer

#### `AuthController` (`src/Filo.Api/Controllers/AuthController.cs`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | GET | Initiates OIDC challenge → redirect to Auth0 |
| `/api/auth/logout` | GET | Signs out of cookie + OIDC → redirect to Auth0 logout |
| `/api/auth/check_session` | GET | Returns all claims as dict (for SPA auth check) |
| `/api/auth/me` | GET | Returns `CurrentUserResponse` from DB (full profile) |
| `/api/auth/debug/cookies` | GET | Debug endpoint returning raw Cookie header |

#### `Program.cs` Middleware Pipeline

```
1. DeveloperExceptionPage (dev only)
2. MapOpenApi (dev only)
3. ApplyMigrationsAsync (dev only)
4. DummyDataSeeder (dev only)
5. UseForwardedHeaders()
     └─ Processes X-Forwarded-* headers from Nginx
6. Debug logging middleware (cookies at auth endpoints)
7. UseRouting()
8. UseAuthentication()
     └─ Runs cookie auth → JWT bearer
     └─ Triggers OnValidatePrincipal → session validation + token refresh
     └─ Triggers CustomClaimsTransformation → permission claims
9. UseAuthorization()
     └─ Evaluates [Authorize] policies
10. MapControllers()
11. MapHealthCheckExtension()
```

---

### Nginx

#### `nginx.conf.template` (`src/Filo.Ui/nginx.conf.template`)

```
Nginx listens on port 8080
         │
         ├── /api/* → proxy_pass to BFF_UPSTREAM (ASP.NET on :5005)
         │            ├── Forwards Host, X-Real-IP, X-Forwarded-* headers
         │            ├── Explicitly passes Cookie header
         │            └── Explicitly passes Set-Cookie header back
         │
         └── /* → serves static files from /usr/share/nginx/html
```

Key settings:
- `proxy_buffer_size 8k`: Increased from default 4k because the auth cookie can exceed 4k when it contains the session ID and metadata
- `large_client_header_buffers 4 16k`: Handles large Auth0 callback URLs and headers
- Cookie passthrough is explicit (`proxy_set_header Cookie`, `proxy_pass_header Set-Cookie`) — this is critical because Nginx normally strips these by default

---

## Accessing the Current User in Commands/Queries

### Current Pattern: Explicit Parameter Passing

The application layer does **not** use `IHttpContextAccessor` or any ambient context. User identity is passed explicitly.

**Example: Getting the current user profile**

```
Controller: AuthController.Me()
  │
  ├── Reads sub claim: User.FindFirstValue("sub")
  │
  └── Passes to MediatR query:
      sender.Send(new GetCurrentUserQuery(identityId))
                           │
                           ▼
      Handler: GetCurrentUserQueryHandler
        ├── Loads user: userRepository.GetByIdentityIdAsync(identityId)
        ├── Loads permissions: userRepository.GetPermissionsByUserIdAsync(user.Id)
        └── Returns CurrentUserResponse
```

**Example: Getting permissions for claims transformation**

```
CustomClaimsTransformation.TransformAsync(principal)
  │
  ├── Reads sub claim: principal.FindFirstValue("sub")
  │
  └── Passes to MediatR query:
      _sender.Send(new GetUserPermissionQuery(identityId))
                           │
                           ▼
      Handler: GetUserPermissionQueryHandler
        ├── Loads user: userRepository.GetByIdentityIdAsync(identityId)
        ├── Loads permissions: userRepository.GetPermissionsByUserIdAsync(user.Id)
        └── Returns PermissionsResponse
```

### How to Add a New Endpoint That Needs the Current User

```csharp
// 1. Define the query/command
public sealed record GetUserProjectsQuery(string IdentityId) : IQuery<ProjectsResponse>;

// 2. Write the handler
internal sealed class GetUserProjectsQueryHandler(
    IUserRepository userRepository) : IQueryHandler<GetUserProjectsQuery, ProjectsResponse>
{
    public async Task<ErrorOr<ProjectsResponse>> Handle(GetUserProjectsQuery request, CancellationToken ct)
    {
        var user = await userRepository.GetByIdentityIdAsync(request.IdentityId, ct);
        if (user is null)
            return Error.NotFound("User.NotFound", "User not found.");

        // ... query projects for user.Id
    }
}

// 3. Wire it in the controller
[HttpGet("projects")]
public async Task<IActionResult> GetProjects(CancellationToken ct)
{
    var identityId = User.FindFirstValue("sub");
    if (identityId is null)
        return Unauthorized();

    var result = await sender.Send(new GetUserProjectsQuery(identityId), ct);
    return result.Match<IActionResult>(Ok, errors => this.ToProblem(errors));
}
```

### Using Permissions in Authorization

```csharp
// Protect an endpoint with a permission
[Authorize(Policy = "file:upload")]
[HttpPost("files")]
public async Task<IActionResult> UploadFile(...)
```

The `PermissionAuthorizationPolicyProvider` auto-resolves `"file:upload"` to a `PermissionRequirement("file:upload")`, and `PermissionAuthorizationHandler` checks if the principal has the matching claim — which was added by `CustomClaimsTransformation` on the current request.

### Service Layer Access (Auth0Client, PermissionService)

For external identity operations (creating users in Auth0, etc.):

```csharp
// IIdentityProviderService — wraps Auth0 Management API calls
// Registered as scoped, uses Auth0Client (HTTP client)
service.AddScoped<IIdentityProviderService, Auth0IdentityProviderService>();

// IPermissionsService — wraps GetUserPermissionQuery via MediatR
// Registered as scoped
service.AddScoped<IPermissionsService, PermissionService>();
```

### MediatR Pipeline Behaviors

Registered in order (outermost first):

1. **`LoggingBehavior<,>`** — Logs execution time and errors
2. **`ValidationBehavior<,>`** — Runs FluentValidation validators before handler
3. **`UnitOfWorkBehavior<,>`** — Calls `SaveChangesAsync` for commands (not queries)

None of these behaviors inject user context. User identity is always passed as explicit parameters.

---

## Cookie Incident Postmortem

### Symptoms

- OIDC callback from Auth0 failed with "Correlation failed"
- The `.Filo.Auth` cookie wasn't being sent by the browser on the callback redirect
- Intermittent: worked sometimes, failed others

### Root Cause

The OIDC flow involves a **top-level navigation redirect** from Auth0 back to the application (`/api/auth/callback`). For this to work, cookies must be sent on the redirect request.

Modern browsers (Chrome 80+) enforce `SameSite` cookie rules:
- `SameSite=None` with `Secure` — sent on cross-site requests (requires HTTPS)
- `SameSite=None` without `Secure` — **rejected by the browser**
- `SameSite=Lax` — sent on top-level navigation from a different site
- `SameSite=Unspecified` — browser applies default (`Lax`)

ASP.NET's OIDC handler was setting correlation and nonce cookies with `SameSite=None` by default, but the app was running on **HTTP** (no Secure), so the browser rejected them.

The `.Filo.Auth` cookie had a similar issue — it was either set to `None` without `Secure`, or set to `Lax` in a way that didn't work with the redirect flow.

### Fix

Set `SameSite=Unspecified` on all three cookies:

| Cookie | File | Setting |
|--------|------|---------|
| Correlation cookie | `OpenIdConnectConfigureOptions.cs` | `options.CorrelationCookie.SameSite = SameSiteMode.Unspecified` |
| Nonce cookie | `OpenIdConnectConfigureOptions.cs` | Inherits default (`Unspecified`) |
| Auth cookie | `CookieConfigureOptions.cs` | `options.Cookie.SameSite = SameSiteMode.Unspecified` |

`Unspecified` omits the `SameSite` attribute entirely. The browser then applies its default behavior (`SameSite=Lax`), which **does** send cookies on top-level navigation redirects — exactly what the Auth0 callback needs.

### Nginx Buffer Issue

The `.Filo.Auth` cookie (containing the server-side ticket key and other metadata) can be large. Nginx's default `proxy_buffer_size` is **4k**, which was not enough to hold the `Set-Cookie` header from the upstream server. This caused the cookie header to be silently dropped:

```
proxy_buffer_size 8k;   ← Fix: increased to 8k
```

### Prevention Rules

| Scenario | SameSite Setting | Secure Policy |
|----------|-----------------|---------------|
| **Development** (HTTP, localhost) | `Unspecified` | `None` (or don't set) |
| **Production** (HTTPS) | `None` | `Always` |

For OIDC flows in development:
1. Always set cookie `SameSite` to `Unspecified`
2. Ensure Nginx's `proxy_buffer_size` is large enough (>4k)
3. Explicitly forward `Cookie` and `Set-Cookie` headers in Nginx config

For production:
1. Use `SameSite=None` with `SecurePolicy=Always`
2. The correlation/nonce cookies should auto-handle this if the scheme is HTTPS

### Files Changed During the Incident

- `src/Filo.Infrastructure/Common/Authentication/OpenIdConnectConfigureOptions.cs` — Correlation cookie SameSite, nonce cookie SameSite (removed explicit Lax)
- `src/Filo.Infrastructure/Common/Authentication/CookieConfigureOptions.cs` — Auth cookie SameSite
- `src/Filo.Ui/nginx.conf.template` — Added `proxy_buffer_size 8k`
- `src/Filo.Infrastructure/Session/InMemorySessionStore.cs` — Changed from Scoped to Singleton (separate issue: session was lost because a new store was created per request)
- `src/Filo.Api/Program.cs` — Added cookie debug logging middleware
