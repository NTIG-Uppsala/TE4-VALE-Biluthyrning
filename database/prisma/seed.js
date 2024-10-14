const { PrismaClient, Prisma } = require('@prisma/client');
const fs = require('fs').promises;

const prisma = new PrismaClient();

// Convert snake_case to camelCase for table names
const snakeToCamel = (str) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

// Read JSON data from files
const readFile = async (path) => {
  try {
    const data = await fs.readFile(`./prisma/seeds/${path}`, 'utf8');
    const dataParsed = JSON.parse(data);
    if (Array.isArray(dataParsed)) return dataParsed;
  } catch (error) {
    console.log(error.message, '<--- Error reading seed file');
  }
  return [];
};

const modelMapping = {
  languages: prisma.languages,
  translation_keys: prisma.translation_keys,
  translations: prisma.translations,
};

const clearDatabase = async () => {
  try {
    // Clear in reverse dependency order to avoid foreign key constraint issues
    console.log("Clearing data from table: translations");
    await modelMapping.translations.deleteMany();

    console.log("Clearing data from table: translation_keys");
    await modelMapping.translation_keys.deleteMany();

    console.log("Clearing data from table: languages");
    await modelMapping.languages.deleteMany();

  } catch (error) {
    console.error(`Error clearing tables:`, error.message);
  }
};

// Seed data back to the database
const seedDatabase = async (tables) => {
  for (const table of Object.keys(tables)) {
    try {
      console.log(`Seeding data for table: ${table}`);
      await modelMapping[table].createMany({ data: tables[table] });
    } catch (error) {
      console.error(`Error seeding table ${table}:`, error.message);
    }
  }
};

// Main function to seed the database
const seedAll = async () => {
  const tables = Object.keys(Prisma.ModelName); // Automatically gets all tables from Prisma schema
  
//clear the database first
  await clearDatabase();

  const merged = await Promise.all(
    tables.map(async (table) => {
      const fileData = await readFile(`${snakeToCamel(table)}.json`);
      return { [table]: fileData };
    })
  );

  const tableData = merged.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  
  await seedDatabase(tableData);
  console.log('Seeding complete');
};

// Execute the function to seed the database
seedAll()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
