const mysql = require("mysql2");

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
}



const connection = mysql.createConnection(dbConfig);


connection.connect((err) => {
    if (err) {
        console.log(`Error connecting to the database: `, err);
        process.exit(1);
    }
    console.log("Connected to database");
})
   

module.exports = connection