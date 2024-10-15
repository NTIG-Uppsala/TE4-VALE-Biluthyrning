# Prisma Guide
*In order to successfully complete this guide, you need:*
* [Node.js](/docs/development-environment.md)
* A MySQL database
## Setting Up Prisma
For the complete and more in-depth guide to setting up Prisma, please visit the official Prisma guides [here.](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)
1. First run the following command to install the Prisma package as a development dependency:
```bash
npm install prisma --save-dev
```
2. Then set up Prisma ORM by running:
```bash
npx prisma init
```
This command does two things:
- Creates a new directory called [prisma](/prisma/) that contains a file called [schema.prisma](/prisma/schema.prisma), which contains the Prisma schema with your database connection variable and schema models.
- Creates the [.env](/.env) file in the root directory of the project, which is used for defining environment variables (such as your database connection).
## Connecting Prisma to the database
1. Navigate to [prisma/schema.prisma](/prisma/schema.prisma).
2. Change `provider = "postgresql"` to `provider = "mysql"` as shown below:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
3. Open the [.env](/.env) file.
4. Change DATABASE_URL to match the [login information of the database](https://docs.google.com/document/d/1e-FzBbY3JdYLGsp38Va0nXPVGH7eKSYGxgbwL7voolg/edit):
```basic
DATABASE_URL="mysql://<mysql-user>:<mysql-password>@<database-server-local-ip>:<mysql-port>/<database-schema>?schema=public"
```

## Using Database Seeding Scripts
- First run:
```bash
node prisma/seedCreator.js
```
This script reads the data in the database and creates JSON files to store that data locally.<br><br>
- Then run:
```bash
node prisma/seed.js
```
This uses the data stored in [step 1](#using-database-seeding-scripts) to populate the database.

---

[Back to README.](/README.md)
