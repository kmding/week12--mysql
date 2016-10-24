var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,
 user: "root",
 password: "b00tShanks",
 database: "Bamazon"
})

connection.query('SELECT * FROM products', function(err, res) {
if (err) throw err;
 for (var i = 0; i < res.length; i++) {
  console.log("ID: " + res[i].itemID + " | Product: " + res[i].ProductName + " | Department: " + res[i].DepartmentName + " | Price: " + res[i].Price + " | Quantity: " + res[i].StockQuantity);
  console.log('=====================================================================================');
 }

  inquirer.prompt([
    {
      message: "Enter the item ID of the item you would like to purchase?",
      type: "input",
      name: "idNum",
      validate: function(value){
        if(isNaN(value) == false && value >= 1 && value <= res.length){
          return true;
        } else{
          return false;
        }
      }
    }, {
      message: "How many would you like to buy?",
      type: "input",
      name: "qty",
      validate: function(value){
        if(isNaN(value) == false){
          return true;
        } else{
          return false;
        }
      }
    }
  ]).then(function(answer){
    var idNum = answer.idNum;
    var qtytoBuy = parseInt(answer.qty);
    //what is available to purchase
    var qty = parseInt(res[idNum-1].StockQuantity);
    var cost = parseFloat(res[idNum-1].Price);
    
    //if what we have in stock is less than what they're asking, console log 'Insufficient Quantity'
    if(qty < qtytoBuy){
      console.log('Sorry, insufficient quantity.');
    } else{
      connection.query('UPDATE products SET ? WHERE ?', [
        {StockQuantity: qty - qtytoBuy},
        {itemID: idNum}
      ], function(err, res){
        if(err) throw err;
        console.log('Your total is $' + (cost*qtytoBuy).toFixed(2));
      });
    }

  });

});