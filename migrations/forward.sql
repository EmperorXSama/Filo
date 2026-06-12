DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'Filo') THEN
        CREATE SCHEMA "Filo";
    END IF;
END $EF$;
CREATE TABLE IF NOT EXISTS "Filo"."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260610125636_InitialCreate') THEN
        IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'Filo') THEN
            CREATE SCHEMA "Filo";
        END IF;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260610125636_InitialCreate') THEN
    CREATE TABLE "Filo"."DummyItems" (
        "Id" uuid NOT NULL,
        "Name" character varying(200) NOT NULL,
        "Description" character varying(1000),
        "IsActive" boolean NOT NULL,
        "CreatedOnUtc" timestamp with time zone NOT NULL,
        "UpdatedOnUtc" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_DummyItems" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260610125636_InitialCreate') THEN
    CREATE INDEX "IX_DummyItems_IsActive" ON "Filo"."DummyItems" ("IsActive");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260610125636_InitialCreate') THEN
    CREATE INDEX "IX_DummyItems_Name" ON "Filo"."DummyItems" ("Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260610125636_InitialCreate') THEN
    INSERT INTO "Filo"."__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260610125636_InitialCreate', '10.0.9');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE TABLE "Filo"."Permissions" (
        "Code" character varying(100) NOT NULL,
        CONSTRAINT "PK_Permissions" PRIMARY KEY ("Code")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE TABLE "Filo"."Roles" (
        "Name" character varying(50) NOT NULL,
        CONSTRAINT "PK_Roles" PRIMARY KEY ("Name")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE TABLE "Filo"."Users" (
        "Id" uuid NOT NULL,
        "IdentityId" text NOT NULL,
        "Status" character varying(20) NOT NULL,
        "CreatedOnUtc" timestamp with time zone NOT NULL,
        "UpdatedOnUtc" timestamp with time zone,
        "IsDeleted" boolean NOT NULL DEFAULT FALSE,
        "DeletedOnUtc" timestamp with time zone,
        "Email" character varying(254) NOT NULL,
        "FullName_FirstName" character varying(100) NOT NULL,
        "FullName_LastName" character varying(100) NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE TABLE "Filo"."RolePermissions" (
        "PermissionsCode" character varying(100) NOT NULL,
        "RoleName" character varying(50) NOT NULL,
        CONSTRAINT "PK_RolePermissions" PRIMARY KEY ("PermissionsCode", "RoleName"),
        CONSTRAINT "FK_RolePermissions_Permissions_PermissionsCode" FOREIGN KEY ("PermissionsCode") REFERENCES "Filo"."Permissions" ("Code") ON DELETE CASCADE,
        CONSTRAINT "FK_RolePermissions_Roles_RoleName" FOREIGN KEY ("RoleName") REFERENCES "Filo"."Roles" ("Name") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE TABLE "Filo"."UserRoles" (
        "RolesName" character varying(50) NOT NULL,
        "UserId" uuid NOT NULL,
        CONSTRAINT "PK_UserRoles" PRIMARY KEY ("RolesName", "UserId"),
        CONSTRAINT "FK_UserRoles_Roles_RolesName" FOREIGN KEY ("RolesName") REFERENCES "Filo"."Roles" ("Name") ON DELETE CASCADE,
        CONSTRAINT "FK_UserRoles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Filo"."Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    INSERT INTO "Filo"."Permissions" ("Code")
    VALUES ('file:download');
    INSERT INTO "Filo"."Permissions" ("Code")
    VALUES ('file:upload');
    INSERT INTO "Filo"."Permissions" ("Code")
    VALUES ('space:create');
    INSERT INTO "Filo"."Permissions" ("Code")
    VALUES ('space:read');
    INSERT INTO "Filo"."Permissions" ("Code")
    VALUES ('space:read.all');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    INSERT INTO "Filo"."Roles" ("Name")
    VALUES ('Administrator');
    INSERT INTO "Filo"."Roles" ("Name")
    VALUES ('Member');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('file:download', 'Administrator');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('file:download', 'Member');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('file:upload', 'Administrator');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('file:upload', 'Member');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('space:create', 'Administrator');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('space:create', 'Member');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('space:read', 'Administrator');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('space:read', 'Member');
    INSERT INTO "Filo"."RolePermissions" ("PermissionsCode", "RoleName")
    VALUES ('space:read.all', 'Administrator');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE INDEX "IX_RolePermissions_RoleName" ON "Filo"."RolePermissions" ("RoleName");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE INDEX "IX_UserRoles_UserId" ON "Filo"."UserRoles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE INDEX "IX_Users_IdentityId" ON "Filo"."Users" ("IdentityId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    CREATE INDEX "IX_Users_IsDeleted" ON "Filo"."Users" ("IsDeleted");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "Filo"."__EFMigrationsHistory" WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions') THEN
    INSERT INTO "Filo"."__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260611131922_CreateUsersRolesPermissions', '10.0.9');
    END IF;
END $EF$;
COMMIT;

