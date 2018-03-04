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
// function which prompts the manager to choose an option from the list
function start() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "Please make a choice from the list below:",
        choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
    })
    //depending on the answer it call different functions
    .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action.toUpperCase() === "VIEW PRODUCTS FOR SALE") {
            viewProducts();
        }
        else if(answer.action.toUpperCase() === "VIEW LOW INVENTORY") {
            viewLowInventory();
        }
        else if(answer.action.toUpperCase() === "ADD TO INVENTORY") {
            addToInventory();
        }
        else {
            addNewProduct();
        }
    });
}
//this function is called every time the manager finishes with his task of choice
//it offers options to go back to main menu or exit the app
function followUp() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "What do you want to do next:",
        choices: ["GO TO MAIN MENU", "EXIT"]
    })
    .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action.toUpperCase() === "GO TO MAIN MENU") {
            start();
        }                
        else {
            console.log("\n" + "\x1b[34mExiting...See you soon!\x1b[0m" + "\n");
            connection.end();
        }
    });
}
//this function shows all the products in inventory in a table for better viewing
function viewProducts(){
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("\n" + "\x1b[32m↑ The Requested Information Is In the Table Above ↑ \x1b[0m" + "\n");
        
        followUp();        
    });
}

//this function list all items with an inventory 
//count of a range that manager sets in the prompt questions 
function viewLowInventory(){
    inquirer
    .prompt([
        {
            name: "minQuantity",
            type: "input",
            message: "Choose a MIN inventory quantity?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "maxQuantity",
            type: "input",
            message: "Choose a MAX inventory quantity?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        console.log("\n Processing your request... \n")
        connection.query(
            "SELECT * FROM products WHERE stock_quantity BETWEEN ? and ?", 
            [answer.minQuantity, answer.maxQuantity],
            function(err, res) { 
                if (err) throw err;
                console.table(res);
                console.log("\n" + "\x1b[32m↑ Selected products above are with inventory count higher than " 
                + answer.minQuantity + " and lower than " + answer.maxQuantity + "\x1b[0m" + "\n");
                
                followUp();
            }
        );
    });
}

//this function adds more quantity of any item currently in inventory
function addToInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //displays the table with the available inventory
        console.table(results);
        // once the items are displayed, prompt the manager which product he wants to update
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
                message: "What product from the table above would you like to update?"
            },
            //prompt for quantity that manager wants to add
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
            console.log("\n" + "Updating quantities...\n");
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
                    console.log("\x1b[32m" + answer.quantity + " more " + chosenItem.product_name + " successfully added to inventory" + "\x1b[0m\n");
                    console.log("\x1b[34m" + "Now you have a total of " + (parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity)) 
                    + " " + chosenItem.product_name + " in your inventory" + "\x1b[0m\n");
                    
                    followUp(); 
                }
            );
        });
    });
}   
// this function allows the manager to add a completely new product to the store
function addNewProduct() { 
    // prompt for info about the product being added to inventory
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
                console.log("\n" + "\x1b[32m" + answer.quantity + " " + answer.product + " at $" + answer.price + " each in " + answer.department + " department are successfully added to inventory" + "\x1b[0m\n");
                
                followUp();
            }
        );
    });
}


