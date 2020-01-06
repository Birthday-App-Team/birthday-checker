const moment = require("moment");
const axios = require("axios");

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
            console.log(person.date_of_birth);
            axios
              .post(
                "https://46m3x72wmb.execute-api.eu-west-2.amazonaws.com/dev/send",
                {
                  recipient_name: person.name,
                  recipient_phone_number: person.phone_number,
                  message: "Happy Birthday!! Have a great day xx",
                  from_phone_number: "+447506190696"
                }
              )
              .then(response => {
                console.log("this is response:", response);
              })
              .catch(err => {
                console.log("Error sending text", err);
              });
          }
        });
        resolve("Checked all people");
      }
    });
  });
};
