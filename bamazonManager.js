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
    password: "",
    database: "bamazonDB"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the manager
    start();
});
// function which prompts the manager for what action they should take
function start() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "Please make a choice from the list below:",
        choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
    })
    .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action.toUpperCase() === "VIEW PRODUCTS FOR SALE") {
            console.log(1);
            viewProducts();
        }
        else if(answer.action.toUpperCase() === "VIEW LOW INVENTORY") {
            console.log(2);
            viewLowInventory();
        }
        else if(answer.action.toUpperCase() === "ADD TO INVENTORY") {
            console.log(3);
            addToInventory();
        }
        else {
            console.log(4);
            addNewProduct();
        }
    });
}

function viewProducts(){
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
}

function viewLowInventory(){
    console.log("Selecting products with inventory lower than 5...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 and 20",  function(err, res) { 
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });
}

function addToInventory() {
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
                message: "What product would you like to update?"
            },
            //prompt for quantity that user wants to purchase
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?",
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
            
            console.log("Updating quantities...\n");
            var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: (parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity))
                    },
                    {
                        id: chosenItem.id       
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log("products updated!\n");
                }
            );
            
            // logs the actual query being run
            console.log(query.sql);
        });
    });
}   

function addNewProduct() {
    
    // prompt for info about the item being put up for auction
    inquirer
    .prompt([
        {
            name: "product",
            type: "input",
            message: "What is the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department would you like to place the product in?"
        },
        {
            name: "price",
            type: "input",
            message: "What would you like the price to be?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "What would you like the quantity to be?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function(err) {
                if (err) throw err;
                console.log("The product was added successfully!");
                // re-prompt the user for if they want to bid or post
                start();
            }
        );
    });
}


