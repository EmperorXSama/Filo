START TRANSACTION;
DROP TABLE "Filo"."RolePermissions";

DROP TABLE "Filo"."UserRoles";

DROP TABLE "Filo"."Permissions";

DROP TABLE "Filo"."Roles";

DROP TABLE "Filo"."Users";

DELETE FROM "Filo"."__EFMigrationsHistory"
WHERE "MigrationId" = '20260611131922_CreateUsersRolesPermissions';

COMMIT;

