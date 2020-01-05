const moment = require("moment");

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "birthdaydb"
});

module.exports.checker = event => {
  // Because the mysql library does not support promises, and we need to return a promise from this function
  // we are wrapping the async code in a new Promise constructor
  // We decide when the async code 'resolves' or 'rejects'
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM Birthdays", function(err, data) {
      if (err) {
        console.log("error getting Birthdays", err);
        reject(err);
      } else {
        data.forEach(person => {
          const birthday = person.date_of_birth;
          if (moment(birthday).format("MM-DD") === moment().format("MM-DD")) {
            console.log("It's your birthday " + person.name + "!!!");
          }
        });
        resolve("Checked all people");
      }
    });
  });
};
