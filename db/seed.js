// grab our client with destructuring from the export in index.js

const { client, getAllUsers, createUser } = require("./index");

// drop, create, seed:

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS users;
    `);
    console.log("finished dropping tables!");
  } catch (error) {
    console.error("error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("starting to build tables...");

    await client.query(`
      CREATE TABLE users (
      id SERIAL PRIMARY KEY, 
      username varchar(255) UNIQUE NOT NULL, 
      password varchar(255) NOT NULL,  
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
       );
    `);

    console.log("finished building tables!");
  } catch (error) {
    console.error("error building tables!");
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function createInitialUsers() {
  try {
    console.log("starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
      name: "big bert",
      location: "bertville",
      active: "",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "sandy koufax",
      location: "LA",
      active: "",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "bunny lebowski",
      location: "venice, ca",
      active: "",
    });

    console.log("finished creating users!");
  } catch (error) {
    console.error("error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
    // console.error(error); - swapped with line above
  }
}

async function testDB() {
  try {
    console.log("starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers", users);
    console.log("finished database tests!");
  } catch (error) {
    console.error(error, "error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => {
    client.end();
  });
