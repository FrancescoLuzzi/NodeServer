const mariadb=require('mariadb');
require("dotenv").config();

const pool = mariadb.createPool({
    host: process.env.MARIADB_IP, 
    user: process.env.MARIADB_USER, 
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DB
});

module.exports = Object.freeze({
    pool: pool
  });