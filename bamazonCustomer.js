let mysql = require("mysql");
let Table = require("cli-table");

// var questionOne = require("./questions.js");
// var prompt = require("./questions.js");


let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password1",
    database: "bamazon_prime"
});

var table = new Table({
    head: ["Product IDs", "Product Names", "Department", "Price", "Left in Stock"]
  , colWidths: [20, 20, 20, 20, 20]
});

connection.connect(function(err){
    if(err){
        console.log("Error connecting! " + err);
        return;
    }
    console.log("Successfully connected as id: " + connection.threadId);
    
    // questionOne();

    listAllProducts();

    connection.end(function(err){
        console.log("Connection terminated!!");
    });
});

function listAllProducts(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if(error){
            console.log("Error with the query! ->" + error);
            return;
        }
        table.push([results[0].item_id, results[0].product_name, results[0].dept_name, results[0].price, results[0].stock_quantity], 
            [results[1].item_id, results[1].product_name, results[1].dept_name, results[1].price, results[1].stock_quantity]);
        console.log(table.toString());
        console.log("\n--------------")
    })
}