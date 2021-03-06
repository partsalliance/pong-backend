// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var exports = module.exports = {};
//mongo mongo
var mongoose   = require('mongoose');
mongoose.connect('mongodb://db:27017/myappdatabase'); // connect to our database

//add table model
var Table = require('./app/models/table');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/tables')

    // create a table (accessed at POST http://localhost:8080/api/tables)
    .post(function(req, res) {
        
        var table = new Table();      // create a new instance of the Table  model
        table.name = req.body.name;  // set the tables name (comes from the request)

        // save the table and check for errors
        table.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'table created!' });
        });
        
    })

    //get all the tables (accessed at Get http://localhost:8080/api/tables)
    .get(function(req, res) {
	Table.find(function(err, tables) {
		if(err)
			res.send(err);

		res.json(tables);
	});
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);

// START THE SERVER
// =============================================================================
var server = app.listen(port, function(){
  console.log('Magie is happening on port ' + port);
});

exports.closeServer = function(){
  console.log('closing server');
  server.close();
};
