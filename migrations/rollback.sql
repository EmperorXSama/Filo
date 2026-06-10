START TRANSACTION;
DROP TABLE "Filo"."DummyItems";

DELETE FROM "Filo"."__EFMigrationsHistory"
WHERE "MigrationId" = '20260610125636_InitialCreate';

COMMIT;

