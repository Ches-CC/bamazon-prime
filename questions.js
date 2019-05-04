let inquirer = require("inquirer");

let prompt = inquirer.createPromptModule();

var questionOne = prompt([{
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
    {
        type: "input",
        message: "Then why are you here, wasting my time?!",
        name: "not_buying",
        when: function(answers) {
            return answers.product_inquiry === "No";
        }
    }
      
    ])
    .then(function(inquirerResponse){
        if(inquirerResponse.productID_prompt === "1"){
            console.log("\nOh, wow! The Deluxe Merkin! No problem!");
        }
        else {
            console.log("\nHmmmm, I think you meant an integer between 0 & 2...");
        }
    });
        
module.exports = {
    questionOne: questionOne,
    prompt: prompt
};