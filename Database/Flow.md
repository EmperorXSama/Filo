# Production Database Migration Guide

Clean Architecture · EF Core · Docker · CI/CD · Azure Key Vault

---

## Table of Contents

1. Core Principles
2. Connection String Locations
3. What Never Changes
4. Least-Privilege Setup
5. Scenario A — First Migration (Brand New Database)
6. Scenario B — Adding a New Migration
7. Scenario C — Modifying a Migration
8. Scenario D — Rolling Back After a Bad Deployment
9. CI/CD Workflow — Full Structure
10. Pipeline Stage Reference
11. Quick Reference Cheatsheet

---

## 1. Core Principles

- **The app never migrates itself in production.** `MigrateAsync()` is development-only.
- **The pipeline is a separate actor** with its own identity and DDL permissions.
- **Migration always runs before deployment.** If migration fails, the old container keeps running.
- **Every migration ships with a rollback script.** Generate it before you ever push.
- **The SQL script is the source of truth**, not `dotnet ef database update`.

---

## 2. Connection String Locations

| Environment | Location | Used By |
| --- | --- | --- |
| Local development | `appsettings.Development.json` | `dotnet run` / IDE |
| Docker Compose | `docker-compose.yml` environment vars | Local containerized run |
| Production (app) | Azure Key Vault — `app-db-connection-string` | Running container (SELECT/INSERT/UPDATE/DELETE only) |
| Production (pipeline) | Azure Key Vault — `pipeline-db-connection-string` | CI/CD migration steps (DDL permissions) |

---

## 3. What Never Changes

These things are **not touched** when you introduce a migration workflow:

| Thing | Change? | Reason |
| --- | --- | --- |
| `appsettings.Development.json` | No | Local dev is unchanged |
| `docker-compose.yml` | No | Docker local setup is unchanged |
| `Dockerfile` | No | Container just runs the app, does not migrate |
| `Program.cs` `MigrateAsync()` call | No | Keep it inside `if (IsDevelopment())` |

The only additions are:

- A second Key Vault secret for the pipeline DDL identity
- Migration and rollback SQL scripts committed alongside your code
- New stages in your CI/CD workflow file

---

## 4. Least-Privilege Setup

Your app's runtime connection string must **never** have DDL permissions. Create two separate secrets in Key Vault:

**`app-db-connection-string`** — for the running container:

```
Server=...;Database=...;User Id=app_user;Password=...
```

Permissions: `db_datareader`, `db_datawriter` only.

**`pipeline-db-connection-string`** — for the CI/CD pipeline:

```
Server=...;Database=...;User Id=pipeline_user;Password=...
```

Permissions: `db_ddladmin` or `db_owner`.

If someone compromises the running container, they cannot drop tables or alter the schema. Only the pipeline identity can do that.

---

## 5. Scenario A — First Migration (Brand New Database)

### What is different about the first migration

- There is no previous migration to roll back to — the rollback target is `0` (empty database).
- The `__EFMigrationsHistory` table does not exist yet — `-idempotent` creates it automatically.
- The production database itself must already exist as an empty shell before the pipeline runs.

### Step 1 — Create the production database (one-time, manual)

The migration script creates your tables but not the database. Do this once via your infrastructure tool before ever running the pipeline.

```bash
# Example — Azure SQL
az sql db create \
  --resource-group myRG \
  --server myServer \
  --name myDatabase \
  --service-objective GP_Gen5_2
```

After this step the pipeline owns all schema changes. You never touch the schema manually again.

### Step 2 — Create the initial migration locally

```bash
dotnet ef migrations add InitialCreate \
  --project src/Infrastructure \
  --startup-project src/API
```

Review the generated `Up()` and `Down()` methods before continuing.

### Step 3 — Generate the forward script

```bash
dotnet ef migrations script \
  --idempotent \
  --output migrations/forward.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

- `-idempotent` wraps every migration in an `IF NOT EXISTS` check against `__EFMigrationsHistory`. Safe to re-run.

### Step 4 — Generate the rollback script

For the first migration, the target is `0` (before any migrations):

```bash
dotnet ef migrations script InitialCreate 0 \
  --output migrations/rollback.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

This drops every table the initial migration created.

### Step 5 — Commit everything together

Commit in a single PR:

- Migration files (`Migrations/` folder)
- `migrations/forward.sql`
- `migrations/rollback.sql`
- Application code that depends on the new schema

Reviewing the SQL script is part of the PR review.

### Step 6 — Pipeline applies the migration

```
Build and test
  → Generate/verify scripts
  → Manual review gate (human reads forward.sql)
  → Pipeline pulls pipeline-db-connection-string from Key Vault
  → Runs forward.sql against production database
  → If success → deploy container
  → If failure → alert, stop, old container keeps running
```

---

## 6. Scenario B — Adding a New Migration

Example: you added a `CreatedAt` column to `Orders`.

### Step 1 — Create the migration locally

```bash
dotnet ef migrations add AddCreatedAtToOrders \
  --project src/Infrastructure \
  --startup-project src/API
```

### Step 2 — Generate the forward script

```bash
dotnet ef migrations script \
  --idempotent \
  --output migrations/forward.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

With `--idempotent`, this script includes all migrations but only applies the ones not yet recorded in `__EFMigrationsHistory`. Running it multiple times is safe.

### Step 3 — Generate the rollback script

Replace `PreviousMigrationName` with the name of the migration before this one:

```bash
dotnet ef migrations script AddCreatedAtToOrders PreviousMigrationName \
  --output migrations/rollback.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

This generates the SQL equivalent of calling `Down()` on just this migration.

### Step 4 — Commit everything together

Same as Scenario A Step 5 — migration files, both SQL scripts, and application code in one PR.

### Step 5 — Pipeline applies the migration

Same pipeline flow as Scenario A Step 6.

---

## 7. Scenario C — Modifying a Migration

**You must never modify a migration that has already been applied to production.** The approach depends on what state the migration is in.

### Case 1 — Migration exists locally but has NOT been pushed to production

You can remove and recreate it safely:

```bash
# Revert the migration locally (removes the last migration file)
dotnet ef migrations remove \
  --project src/Infrastructure \
  --startup-project src/API

# Fix your model, then recreate
dotnet ef migrations add AddCreatedAtToOrders \
  --project src/Infrastructure \
  --startup-project src/API
```

Then regenerate both SQL scripts and commit.

### Case 2 — Migration HAS been applied to production

Do not touch the existing migration. Add a corrective migration on top:

```bash
dotnet ef migrations add FixCreatedAtColumnType \
  --project src/Infrastructure \
  --startup-project src/API
```

Generate new forward and rollback scripts for this corrective migration and follow the same pipeline flow as Scenario B.

---

## 8. Scenario D — Rolling Back After a Bad Deployment

Migration ran, container deployed, something is broken. Act in this order.

### Step 1 — Redeploy the previous container image immediately

Before touching the database, restore the app to a working state. Your container registry always has the previous image tagged. Redeploy it now.

The previous app code is compatible with the current schema because the column was just added — it did not break existing queries.

```bash
# Example — Azure Container Apps
az containerapp update \
  --name myApp \
  --resource-group myRG \
  --image myregistry.azurecr.io/myapp:previous-tag
```

### Step 2 — Run the rollback script against production

Use the `rollback.sql` artifact that was saved during the pipeline run that caused this:

```bash
sqlcmd \
  -S $PROD_SERVER \
  -d $PROD_DB \
  -U $PIPELINE_USER \
  -P $PIPELINE_PASSWORD \
  -i migrations/rollback.sql
```

This runs the SQL equivalent of the migration's `Down()` method — dropping the column, reverting the index, whatever the migration added.

### Step 3 — Remove the migration from code

```bash
dotnet ef migrations remove \
  --project src/Infrastructure \
  --startup-project src/API
```

Commit this removal so the codebase matches the database state again.

### Step 4 — Investigate, fix, and restart from Scenario B

Find the root cause, fix the code and model, then create a new migration following Scenario B.

---

## 9. CI/CD Workflow — Full Structure

This is written for GitHub Actions. The same logic applies to Azure DevOps (stages with `dependsOn`) or any other system.

```yaml
name: Build, Migrate, Deploy

on:
  push:
    branches: [main]

jobs:

  # ─────────────────────────────────────────
  # Stage 1 — Build and test
  # ─────────────────────────────────────────
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore
        run: dotnet restore

      - name: Build
        run: dotnet build --no-restore --configuration Release

      - name: Test
        run: dotnet test --no-build --configuration Release

  # ─────────────────────────────────────────
  # Stage 2 — Generate migration scripts
  # ─────────────────────────────────────────
  generate-scripts:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Install EF tools
        run: dotnet tool install --global dotnet-ef

      - name: Generate forward script
        run: |
          dotnet ef migrations script \
            --idempotent \
            --output migrations/forward.sql \
            --project src/Infrastructure \
            --startup-project src/API \
            --configuration Release

      - name: Generate rollback script
        run: |
          # Replace CURRENT and PREVIOUS with your actual migration names
          # For the very first migration, replace PREVIOUS with 0
          dotnet ef migrations script ${{ vars.CURRENT_MIGRATION }} ${{ vars.PREVIOUS_MIGRATION }} \
            --output migrations/rollback.sql \
            --project src/Infrastructure \
            --startup-project src/API \
            --configuration Release

      - name: Upload scripts as pipeline artifacts
        uses: actions/upload-artifact@v4
        with:
          name: migration-scripts
          path: |
            migrations/forward.sql
            migrations/rollback.sql
          retention-days: 30

  # ─────────────────────────────────────────
  # Stage 3 — Manual review gate
  # ─────────────────────────────────────────
  # A human downloads forward.sql from the artifacts tab
  # and reads it before approving this stage.
  # Configure "production" as a GitHub Environment with
  # required reviewers under Settings → Environments.
  review-gate:
    needs: generate-scripts
    runs-on: ubuntu-latest
    environment: production   # <-- triggers the required reviewer approval
    steps:
      - name: Waiting for migration review approval
        run: echo "Migration scripts approved. Proceeding."

  # ─────────────────────────────────────────
  # Stage 4 — Apply migration
  # ─────────────────────────────────────────
  apply-migration:
    needs: review-gate
    runs-on: ubuntu-latest
    steps:
      - name: Download migration scripts
        uses: actions/download-artifact@v4
        with:
          name: migration-scripts
          path: migrations/

      - name: Login to Azure
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Get pipeline connection string from Key Vault
        id: get-conn
        run: |
          CONN=$(az keyvault secret show \
            --vault-name ${{ vars.KEYVAULT_NAME }} \
            --name pipeline-db-connection-string \
            --query value -o tsv)
          echo "::add-mask::$CONN"
          echo "connection_string=$CONN" >> $GITHUB_OUTPUT

      - name: Parse connection string parts
        id: parse-conn
        run: |
          # Parse individual parts from the connection string for sqlcmd
          # Adjust parsing logic to match your connection string format
          echo "server=$(echo '${{ steps.get-conn.outputs.connection_string }}' | grep -oP '(?<=Server=)[^;]+')" >> $GITHUB_OUTPUT
          echo "database=$(echo '${{ steps.get-conn.outputs.connection_string }}' | grep -oP '(?<=Database=)[^;]+')" >> $GITHUB_OUTPUT
          echo "user=$(echo '${{ steps.get-conn.outputs.connection_string }}' | grep -oP '(?<=User Id=)[^;]+')" >> $GITHUB_OUTPUT
          echo "password=$(echo '${{ steps.get-conn.outputs.connection_string }}' | grep -oP '(?<=Password=)[^;]+')" >> $GITHUB_OUTPUT

      - name: Apply forward migration script
        run: |
          sqlcmd \
            -S "${{ steps.parse-conn.outputs.server }}" \
            -d "${{ steps.parse-conn.outputs.database }}" \
            -U "${{ steps.parse-conn.outputs.user }}" \
            -P "${{ steps.parse-conn.outputs.password }}" \
            -i migrations/forward.sql \
            -b   # -b causes sqlcmd to exit with error code on failure

      # If the step above fails, this job fails.
      # The deploy-container job will not run.

  # ─────────────────────────────────────────
  # Stage 5 — Deploy container
  # ─────────────────────────────────────────
  # Only runs if apply-migration succeeded.
  deploy-container:
    needs: apply-migration
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Azure
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Login to container registry
        run: |
          az acr login --name ${{ vars.ACR_NAME }}

      - name: Build and push image
        run: |
          IMAGE=${{ vars.ACR_NAME }}.azurecr.io/myapp:${{ github.sha }}
          docker build -t $IMAGE .
          docker push $IMAGE

      - name: Deploy to production
        run: |
          az containerapp update \
            --name ${{ vars.APP_NAME }} \
            --resource-group ${{ vars.RESOURCE_GROUP }} \
            --image ${{ vars.ACR_NAME }}.azurecr.io/myapp:${{ github.sha }}
```

---

## 10. Pipeline Stage Reference

### When each stage runs

| Stage | Trigger | What it does | Fails if |
| --- | --- | --- | --- |
| `build-and-test` | Every push to main | Build, unit tests, integration tests | Any test fails |
| `generate-scripts` | `build-and-test` passes | Generates `forward.sql` and `rollback.sql`, uploads as artifacts | EF tools error, bad migration state |
| `review-gate` | Scripts generated | Waits for human approval | Reviewer rejects |
| `apply-migration` | Human approved | Pulls connection string from Key Vault, runs `forward.sql` | SQL error, connection error |
| `deploy-container` | Migration succeeded | Builds image, pushes to registry, updates running container | Docker/ACI error |

### What the reviewer should check in `forward.sql`

- The tables and columns being created or altered match what you expect
- No unexpected `DROP TABLE` or `DROP COLUMN` statements
- Column types are correct
- The `IF NOT EXISTS` idempotency guards are present
- Foreign key constraints look correct

### Secrets and variables to configure

| Name | Type | Value |
| --- | --- | --- |
| `AZURE_CREDENTIALS` | Secret | Service principal JSON for Azure login |
| `KEYVAULT_NAME` | Variable | Your Key Vault name |
| `ACR_NAME` | Variable | Your Azure Container Registry name |
| `APP_NAME` | Variable | Your Container App name |
| `RESOURCE_GROUP` | Variable | Your resource group |
| `CURRENT_MIGRATION` | Variable | Updated per PR — name of the new migration |
| `PREVIOUS_MIGRATION` | Variable | Updated per PR — name of the migration before it (or `0` for first) |

---

## 11. Quick Reference Cheatsheet

### Creating a migration

```bash
dotnet ef migrations add MigrationName \
  --project src/Infrastructure \
  --startup-project src/API
```

### Generating the forward script (all scenarios)

```bash
dotnet ef migrations script \
  --idempotent \
  --output migrations/forward.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

### Generating the rollback script

```bash
# For second migration onwards
dotnet ef migrations script CurrentMigration PreviousMigration \
  --output migrations/rollback.sql \
  --project src/Infrastructure \
  --startup-project src/API

# For the very first migration
dotnet ef migrations script InitialCreate 0 \
  --output migrations/rollback.sql \
  --project src/Infrastructure \
  --startup-project src/API
```

### Removing the last migration (local only, not yet in production)

```bash
dotnet ef migrations remove \
  --project src/Infrastructure \
  --startup-project src/API
```

### Running a script manually (emergency rollback)

```bash
sqlcmd \
  -S $SERVER \
  -d $DATABASE \
  -U $USER \
  -P $PASSWORD \
  -i migrations/rollback.sql \
  -b
```

### Decision tree

```
New feature needs a schema change?
  → dotnet ef migrations add
  → Generate forward.sql and rollback.sql
  → Commit both alongside application code
  → PR review includes reviewing forward.sql
  → Pipeline runs: build → scripts → review gate → migrate → deploy

Something went wrong after deployment?
  → Redeploy previous container image first (restores app health)
  → Run rollback.sql against production database
  → dotnet ef migrations remove from codebase
  → Commit the removal
  → Investigate, fix, start over

Migration already in production and needs a fix?
  → Never modify it
  → Add a new corrective migration on top
  → Follow normal flow
```