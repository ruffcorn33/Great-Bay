var mysql = require('mysql');
var inquirer = require('inquirer');

// create a connection to database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'M4sterl0ck',
  database: 'GreatBayDB'
});

// connect to database
connection.connect(function(err){
  if (err) throw err; 
  // console.log('Connected on ' + connection.threadId);
  start();
});

// main routine
function start(){
  inquirer
    .prompt({
      name: 'post_or_bid',
      type: 'list',
      message: "Post a new item or Bid on an item?",
      choices: ['POST','BID','QUIT']
    })
    .then(function(answer){
      if (answer.post_or_bid === 'POST'){
        postItem();
      }
      else if (answer.post_or_bid === 'BID'){
        bidItem();
      }       
      else {
        return;
      };
    });
}

function postItem(){
  // console.log('POST is under construction');
  inquirer
    .prompt([{
      name: 'item',
      type: 'input',
      message: 'What Item do you want to post for auction?'
    },
    {
      name: 'category',
      type: 'input',
      message: 'What category is your item in?'
    },
    {
      name: 'bid',
      type: 'input',
      message: 'What is the minimum bid?',
      validate: function(value){
        if (isNaN(value)){
          return false
        }
        return true
      }
    }])
    .then(function(answer){
      createItems(answer.item, answer.category, answer.bid);
      clearScreen();
      console.log('Your item ' + answer.item + ' was added to ' + answer.category + ' with a starting bid of ' + answer.bid + '\n');      
      start();
    });
}

function bidItem(){
  // console.log('BID is under construction');
  connection.query('select * from items', function(err, res){
    inquirer
      .prompt(
        {
          name: 'item',
          type: 'list',
          choices: function(value){
            var choiceArray = [];
            for(i=0; i<res.length; i++){
              choiceArray.push(res[i].description)
            }
            return choiceArray;
          },
          message: 'Which item do you want to bid on?'
        }
      )
      .then(function(answer){
        for(i=0; i<res.length; i++){
          if(res[i].description === answer.item){
            var chosenItem = res[i];
            inquirer
              .prompt({
                name: 'bid',
                type: 'input',
                message: "Current bid is " + res[i].high_bid + " How much will you bid?",
                validate: function(value){
                  if (isNaN(value)){
                    return false
                  }
                  return true
                }
              })
              .then(function(answer){
                if(chosenItem.high_bid < parseInt(answer.bid)){
                  updateItems(answer.bid, chosenItem.id, chosenItem.description);
                  clearScreen();    
                  console.log('Congratulations! Your bid of ' + answer.bid + ' for ' + chosenItem.description + ' is now the high bid.\n');              
                  start();
                }
                else{
                  clearScreen();
                  console.log('Your bid of ' + answer.bid + ' was too low.  Try again...\n');
                  start();
                }
              })
          }
        }
      })
  });
}

function createItems(item, category, bid){
  console.log('inserting a new item...');
  var query= connection.query(
    "insert into items set ?", {
      description: item,
      category: category,
      bid: bid,
      high_bid: bid
    },
    function(err, res){
      if(err) throw err;      
      // console.log(res.affectedRows + ' item inserted!\n');
    }
  );
}

function updateItems(bid, id, item){
  var query = connection.query(
    'update items set ? where ?',
    [
      {
        bid: bid
      },
      {
        id: id
      }      
    ],
    function(err,res){
      if(err) throw err;      
      // console.log(res);
    }
  );
}

function deleteItems(){
  console.log('deleting an item...')
  connection.query(
    'delete from items where ?',
    {
      id: 1
    },
    function(err, res){
      if(err) throw err;
      console.log(res);
    }
  );
}

function clearScreen(){
  // clear output from this application/prevent scrolling
  process.stdout.write('\033c'); 
}