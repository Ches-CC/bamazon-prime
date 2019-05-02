let inquirer = require("inquirer");

let prompt = inquirer.createPromptModule();

var questionOne = prompt([{
    type: "input",
    message: "Please enter ID of the product you'd like to buy!",
    name: "product_inquiry"
    }])
    .then(function(inquirerResponse){
        if(inquirerResponse.product_inquiry === "1"){
            console.log("\nOh, wow! The Deluxe Merkin! No problem!")
        }
        else {
            console.log("\nHmmmm, I think you meant an integer between 0 & 2...");
        }
    });
        
module.exports = {
    questionOne: questionOne,
    prompt: prompt
};