// dependency for inquirer npm package
var inquirer = require("inquirer");
//// dependency for mysql npm package
var mysql = require("mysql");
// dependency for console.table npm package
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    
    // Your username
    user: "root",
    
    // Your password or leave it blank if no password is required
    password: "Havefun102",
    database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the user
    start();
});
//Start function that includes all of the user's activity and response
function start() {
    // query the database for all items available for sale
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //displays the table with the available inventory
        console.table(results);
        // once the items are displayed, prompt the user for which they'd like to buy 
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
            //prompt for quantity that user wants to purchase
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
            //if there is enough inventory from the chosen item proceed with the sale
            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        { 
                            //updating the quantity left in stock after the sale
                            stock_quantity: (chosenItem.stock_quantity - answer.quantity) 
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    //if there is no error triggered inform the user of the successful transaction and the total price
                    function(error) {
                        if (error) throw err;
                        console.log("\n" + "\x1b[32mOrder placed successfully!\x1b[0m");
                        console.log("Your total is: " + ("\x1b[32m" + "$" + answer.quantity * chosenItem.price + "\x1b[0m" + "\n")); 
                        //prompting if the user wants to shop more 
                        inquirer.prompt([{
                            name: 'order',
                            type: 'confirm',
                            message: 'Would you like to place another order?'
                        }]).then(function (response) {
                            if (response.order) {
                                console.log("\n" + "\x1b[34mPlease see the product choices in the table!\x1b[0m");
                                //if confirmed that user want to make another purchase restart the app
                                start();
                            } else {
                                console.log("\n" + "\x1b[34mBye! Come again!\x1b[0m");
                                connection.end();
                            }
                        });
                    }
                );
            }
            //if there is not enough quantity in stock
            else {
                console.log("\n" + "\x1b[31mInsufficient quantity! See the table above and try again...\x1b[0m" + "\n");
                //and prompt the user if he wants to order a different quantity 
                inquirer.prompt([{
                    name: 'order',
                    type: 'confirm',
                    message: 'Would you like to try again with different quantity or different item?'
                }]).then(function (response) {
                    if (response.order) {
                        console.log("\n" + "\x1b[34mPlease see the available quantities in the table!\x1b[0m");
                        //if confirmed that user want to adjust the quantity or pick another item restart the app
                        start();
                    } else {
                        console.log("\n" + "\x1b[34mBye! Come again!\x1b[0m");
                        connection.end();
                    }
                }); 
            }
            
        });
    });
}

//   if (chosenItem.stock_quantity === 0){
//     connection.query(
//         "DELETE FROM products WHERE ?",
//         {
//           stock_quantity: 0
//         },
//     );
// }
