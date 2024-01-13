require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection(); 

    await connection.query('DROP TABLE IF EXISTS tweet'); 
    await connection.query('DROP TABLE IF EXISTS user');

    console.log('Creating tables');

    await connection.query(`
      CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE tweet (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        text VARCHAR(280) NOT NULL,
        image VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release(); 
    process.exit();
  }
}

main().catch((error) => console.error(error));