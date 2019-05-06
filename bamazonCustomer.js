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
    head: ["Product IDs", "Product Names", "Department", "Price", "Left in Stock"]
  , colWidths: [20, 20, 20, 20, 20]
});

connection.connect(function(err){
    if(err){
        console.log("Error connecting! " + err);
        return;
    }
    // console.log("Successfully connected as id: " + connection.threadId);
    listAllProducts();
    prodInfoToArray();
    let dbItemQuery = "";
    //////Beginning Inquirer Prompts Here to experiment with the L O G I C
    prompt([{
        type: "input",
        message: "Would you like to buy a product today?",
        name: "product_inquiry"
    },
    {
        type: "input",
        message: "Please enter the Product ID of the product you would like to purchase",
        name: "productID_prompt",
        when: function(answers) {
            return answers.product_inquiry === "Yes";
        }
    },
    //This one below belongs in the .then portion bc its not a question
    {
        type: "input",
        message: "Then why are you here, wasting my time?!",
        name: "not_buying",
        when: function(answers) {
            return answers.product_inquiry === "No";
        }
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
    //this one below belongs in the .then portion bc it's not a question
    // {
    //     type: "input",
    //     message: "You're all set, here is your receipt!",
    //     name: "purchase_complete",
    //     when: function(answers){
    //         return dbItemQuery.stock_quantity >= parseInt(answers.purchase_quantity);
    //     }
    // },
    // {
    //     type: "input",
    //     message: "As much as we'd love to take your money, we don't have enough in stock! How embarrassing! \nPlease take another look at our selection of products!",
    //     name: "out_of_stock",
    //     when: function(answers){
    //         return dbItemQuery.stock_quantity < parseInt(answers.purchase_quantity);
    //     }
    // }
    ])

    .then(function(answers){

        connection.query("SELECT * FROM products WHERE item_id = ?", [answers.productID_prompt], function(error, results, fields){
            if(error){
                console.log("Error in the ID answers query: " + error);
                return;
            }
            dbItemQuery = results[0];
            if (dbItemQuery.stock_quantity < answers.purchase_quantity){
                console.log("We ain't got 'nuff!")
                return;
            }else{
                totalPrice = dbItemQuery.price * answers.purchase_quantity;
                console.log("Great, here is your total: $" + totalPrice);
                let newStockQuant = (dbItemQuery.stock_quantity - answers.purchase_quantity);
                connection.query("UPDATE products SET stock_quantity = " + newStockQuant + " WHERE item_id = " + answers.productID_prompt, function(error, results, fields){
                    if (error){
                        console.log("Error updating dB" + error)
                        return;
                    }
                    console.log("Database stock quantity updated!");
                    listAllProducts();
                })
            }
        })
        // if (answers.purchase_complete === "You're all set, here is your receipt"){
        // console.log("Insert the Receipt here: \nProduct: Name\nPrice: $XYZ.00\nQuantity: X\nTotal Price: $XYZ" + 
        // "\n& \nUpdate the Database! ...no biggie lol");
        // }else{console.log("See you next Tuesday!")}
    })


    ////END of Question L O G I C experimentation

    //Not sure if I want to use this array method... yet
    // prodInfoToArray();
    // connection.end(function(err){
    //     console.log("Connection terminated!!\n- - - - -");
    // });
});

function listAllProducts(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if(error){
            console.log("Error with the query!-->" + error);
            return;
        }
        table.splice(0, table.length);
        table.push([results[0].item_id, results[0].product_name, results[0].dept_name, results[0].price, results[0].stock_quantity], 
            [results[1].item_id, results[1].product_name, results[1].dept_name, results[1].price, results[1].stock_quantity]);
        console.log(table.toString());
        console.log("\n----------")
    })
}



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

        // idArray.split(",");
        // idArray.slice(1).join(" ");

        // These arrays all print as one might expect, but might need to be Splice/Joined?!
        // console.log("Available IDs: " + idArray + "\n"
        //  + "Available Products: " + namesArray + "\n"
        //  + "Available Prices: " + priceArray + "\n"
        //  + "Available Stock Amounts: " + stockArray + "\n"
        //  + "Selectable Depts: " + deptArray + "\n----------");

        //  if (idArray.includes(5)){
        //      console.log("idArray includes 5, fool!")
        //  }else{console.log("This includes-biz ain't working")}
    })
}