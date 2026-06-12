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

