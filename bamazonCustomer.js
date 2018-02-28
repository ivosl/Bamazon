var inquirer = require("inquirer");

var mysql = require("mysql");
require("console.table");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("connected as id " + connection.threadId);
  start();
});

  function start() {
      // query the database for all items available for sale
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.table(results);
    // once you have the items, prompt the user for which they'd like to buy
    inquirer
    .prompt([
      {
        name: "id",
        type: "rawlist",
        choices: function() {
          var productsArray = [];
          for (var i = 0; i < results.length; i++) {
            productsArray.push(results[i].product_name);
          }
          return productsArray;
        },
        message: "What item would you like to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.id) {
            chosenItem = results[i];
          }
        }

        if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
            // there is enough quantity in stock
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: (chosenItem.stock_quantity - answer.quantity) 
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("\n" + "\x1b[32mOrder placed successfully!\x1b[0m");
                console.log("Your total is: " + ("\x1b[32m" + "$" + answer.quantity * chosenItem.price + "\x1b[0m" + "\n")); 
                inquirer.prompt([{
                    name: 'order',
                    type: 'confirm',
                    message: 'Would you like to place another order?'
                }]).then(function (response) {
                    if (response.order) {
                        console.log("\n" + "\x1b[34mPlease see the product choices in the table!\x1b[0m");
                        start();
                    } else {
                        console.log("\n" + "\x1b[34mBye! Come again!\x1b[0m");
                    }
                });

                // start();
              }
            );
          }
          else {
              //not enough quantity in stock
            console.log("\x1b[31mInsufficient quantity! See the table above and try again...\x1b[0m");
            start(); 
          }
    
        });
    });
  }
  