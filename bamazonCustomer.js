let mysql = require("mysql");
let Table = require("cli-table");

// INQUIRER--> Attempt to require from questions.js module.exports...
let inquirer = require("inquirer");
let prompt = inquirer.createPromptModule();
// var questionOne = require("./questions.js");
// questionOne();

//A few global vars into which we can push DB Data, which in turn can be accessed by the Inquirer prompts (finders crossed!)
let idArray = [];
let stockArray = [];
let namesArray = [];
let priceArray = [];
let deptArray = [];

//Qustionable Glo-Var:
let dbResult = [];

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password1",
    database: "bamazon_prime"
});

var table = new Table({
    head: ["ID", "Product Name", "Price", "Stock"],
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
        'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
        'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
        'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    colWidths: [5, 40, 10, 10]
});

connection.connect(function(err){
    if(err){
        console.log("Error connecting! " + err);
        return;
    }
    console.log("Successfully connected to www.BAMAZON.com via threadID: " + connection.threadId);
});

//Call the function to display the table
listAllProducts();

//Call the function which stores the product values in arrays, enables us easily/quickly validate user's query/queries 
prodInfoToArray();

//Initial Prompt function called
questionDisplay();

//Global var in which we'll store the DB product query
let dbItemQuery = "";

//Here are the Inquirer prompts; set a Timeout function to keep from overwriting the neat table I made with CLI-table
function questionDisplay(){setTimeout(function(){prompt([{
    type: "input",
    message: "Please enter the Product ID of the product you would like to purchase",
    name: "productID_prompt",
    //validation
    
},    
{
    type: "input",
    message: "Very nice! How many would you like to purchase?",
    name: "purchase_quantity",
    when: function(answers) {
        // console.log("Very nice LOL: + " + idArray + " & the input was: " + answers.productID_prompt);
        return idArray.includes(parseInt(answers.productID_prompt)) === true;
    }
},
{
    type: "input",
    message: "Aw shucks--that's not a valid Product ID. \nPlease enter take another look at our product selection!",
    name: "wrong_id",
    when: function(answers) {
        // console.log("Very nice LOL: + " + idArray + " & the input was: " + answers.productID_prompt);
        return idArray.includes(parseInt(answers.productID_prompt)) === false;
    }
},
{
    type: "confirm",
    message: "Would you like to take another look at our offerings?",
    name: "option_restart",
    choice: ["Heck yeah!", "Naw, I'm good..."],
    default: "Heck yeah!",
    when: function(answers) {
        return;
    }
}
])
.then(function(answers){

    connection.query("SELECT * FROM products WHERE item_id = ?", [answers.productID_prompt], function(error, results, fields){
        if(error){
            console.log("Error in the ID answers query: " + error);
            return;
        }
        dbItemQuery = results[0];
        if (dbItemQuery.stock_quantity < answers.purchase_quantity){
            console.log("As much as we'd love to take your money, we don't have enough in stock! How embarrassing!")
            return;
        }else{
        //     //Display the total purchase amount
            totalPrice = dbItemQuery.price * answers.purchase_quantity;
            console.log("Great, here is your total: $" + totalPrice);
            //Updating database inventory
            let newStockQuant = (dbItemQuery.stock_quantity - answers.purchase_quantity);
            connection.query("UPDATE products SET stock_quantity = " + newStockQuant + " WHERE item_id = " + answers.productID_prompt, function(error, results, fields){
                if (error){
                    console.log("Error updating dB" + error);
                    return;
                }
                //Confirmation that the database has been updated
                console.log("Database stock quantity updated!");
                // listAllProducts();
                // prompt();
            })
        }
    })
    // if (answers.purchase_complete === "You're all set, here is your receipt"){
    // console.log("Insert the Receipt here: \nProduct: Name\nPrice: $XYZ.00\nQuantity: X\nTotal Price: $XYZ" + 
    // "\n& \nUpdate the Database! ...no biggie lol");
    // }else{console.log("See you next Tuesday!")}
})}, 500)};

function listAllProducts(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if(error){
            console.log("Error with the query!-->" + error);
            return;
        }
        table.splice(0, table.length);
        for(var i = 0; i < results.length; i++){
            table.push([results[i].item_id, results[i].product_name, "$" + parseFloat(results[i].price), results[i].stock_quantity]);
           }
        console.log(table.toString());
        console.log("\n----------")
    })
}

//Pushing product information to an array to more easily-manipulate the results data (where needed)
function prodInfoToArray(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if(error){
            console.log("Error capturing IDs!-->" + error);
            return;
        }
        for(var i = 0; i < results.length; i++){
            idArray.push(results[i].item_id);
            stockArray.push(results[i].stock_quantity);
            namesArray.push(results[i].product_name);
            priceArray.push(results[i].price);
            deptArray.push(results[i].dept_name);
            dbResult.push(results[i]);
        }
    });
}