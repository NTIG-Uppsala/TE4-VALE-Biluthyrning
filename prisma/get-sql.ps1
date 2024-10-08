mkdir -p prisma/migrations/0_init -ErrorAction SilentlyContinue
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
Write-Host "Migration script generated at prisma/migrations/0_init/migration.sql"