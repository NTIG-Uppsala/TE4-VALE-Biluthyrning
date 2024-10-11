const { PrismaClient, Prisma } = require('@prisma/client');
const fs = require('fs').promises;

const prisma = new PrismaClient();

// Convert snake_case to camelCase for table names
const snakeToCamel = (str) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

// Write JSON data to file
const writeTable = async (table, value, folder) => {
  const tableNameCamelCase = snakeToCamel(table);
  const dir = `./prisma/${folder}`;
  await fs.mkdir(dir, { recursive: true });
  return fs.writeFile(
    `${dir}/${tableNameCamelCase}.json`,
    `${JSON.stringify(value, null, 2)}`
  );
};

// Remove null elements from objects
const removeNullElements = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] === null) {
      return acc;
    }
    acc[key] = obj[key];
    return acc;
  }, {});
};

// Create seed data and write it to files
const createAllSeeds = async (tables, folder) => {
  await Promise.allSettled(
    Object.keys(tables).map((key) => {
      return writeTable(key, tables[key], folder);
    })
  );
};

// Read and filter data from tables
const findAndRefind = async (tables) => {
  const selectsAll = await Promise.allSettled(
    tables.map((table) => {
      return prisma[table].findMany({
        take: 1000, // Limiting rows for each query to 1000
      });
    })
  );

  const merged = selectsAll.reduce((acc, result, i) => {
    if (result.status === 'fulfilled') {
      acc[tables[i]] = result.value.map((item) => removeNullElements(item));
    }
    return acc;
  }, {});

  return merged;
};

// Main function to create seed data
const readAllTables = async ({ allSeeds = false, logTables = true, folderName = 'seeds' } = {}) => {
  const tables = Object.keys(Prisma.ModelName); // Automatically gets all tables from Prisma schema
  
  const merged = !allSeeds ? {} : await findAndRefind(tables);

  if (logTables) {
    console.log('Start -->', merged, '<-- End');
  }

  if (allSeeds) {
    await createAllSeeds(merged, folderName);
  }

  console.log('Done ---');
  return { tables, collections: merged };
};

// Execute the function to create seeds
readAllTables({
  allSeeds: true,  // Set to true to generate the seeds
  logTables: false, // Set to true to log the tables during the process
});
