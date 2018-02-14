var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'M4sterl0ck',
  database: 'GreatBayDB'
});

connection.connect(function(err){
  if (err) throw err;
  
  console.log('Connected on ' + connection.threadId);

  // createItems();

  // readItems();

  // updateItems();

  // deleteItems();

  connection.end();

});

function createItems(){
  console.log('inserting a new item...');

  var query= connection.query(
    "insert into items set ?", {
      description: 'Computer Monitor',
      category: 'Computers',
      bid: 20.00
    },
    function(err, res){
      if(err) throw err;
      console.log(res.affectedRows + ' item inserted!\n');
    }
  )
}

function readItems(){
  console.log('select items...');
  connection.query('select * from items', function(err, res){
    if(err) throw err;
    console.log(res);
  })
}

function updateItems(){
  console.log('Updating an item...\n');
  var query = connection.query(
    'update items set ? where ?',
    [
      {
        bid: 25.00
      },
      {
        description: 'Computer Monitor'
      }      
    ],
    function(err,res){
      if(err) throw err;
      console.log(res.message);
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
      console.log(res);d
    }
  );
}
