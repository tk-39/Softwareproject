var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const port = 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('views'));
//database connection
const db = mysql.createConnection ({
	host:'localhost',
	user:'root',
	password:'Project!',
	database: 'recyclingproject'
});

//connecting to database
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('Connectect to database!');
});
global.db = db;

//set directory for HTML files
app.set('views',__dirname + '/views');

//telling express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

//telling express how we want the html files to be rendered
app.engine('html', ejs.renderFile);

//route handling
app.get('/', function(req,res){
	res.render('index.html')
});

app.get('/signup', function(req,res){
	res.render('signup.html')
});

app.get('/nearby', function(req,res){
	res.render('nearby.html')
});

app.get('/search', function(req,res){
	res.render('search.html')
});

app.get('/search-results', function(req,res){
	let key = '%' + req.query.keyword + '%'
	let sqlquery = 'SELECT name FROM normalview WHERE name LIKE ?'

	db.query(sqlquery,[key, key],(err,result) => {
		if(err){
			res.redirect('./');
		}

		let dbData = Object.assign({},{recyclinginfo:result});
		res.render('search-results.html', dbData);
	});
});

app.get('/material/:name', function(req,res){
	let sqlquery ='SELECT name, recommended, avoid, tips FROM normalview WHERE name = ?'
	db.query(sqlquery,[req.params.name], (err, result) => {
		if (err){
			res.redirect('./');
		}
		let dbData = Object.assign({},{recyclinginfo:result[0]});
	res.render('material.html',dbData)
	});
});


app.get('/database', function(req,res){
	//get the table
	let sqlquery = "SELECT name, recommended, avoid FROM normalview";
	//execute the query
	db.query(sqlquery, (err, result) => {
		if(err){
			res.redirect('./');
	}
		let dbData = Object.assign({},{recyclinginfo:result});
	res.render('database.html',dbData);
	});
});

//listening
app.listen(port,() => console.log('App listening! Press CRTL + C to end.'))
