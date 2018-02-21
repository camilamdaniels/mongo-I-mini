const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bear = require('./bears/BearModel.js');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors());   // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

server.post('/api/bears', (req, res) => {
	const bearInformation = req.body;

	if (!bearInformation.species || !bearInformation.latinName) {
		res.status(400).json({
			error: 'Please provide both species and a latinName for the Bear.'
		})
	} else {
		const bear = new Bear(bearInformation);
		bear.save()
			.then((newBear) => {
				res.status(201).json(newBear);
			})
			.catch((error) => {
				res.status(500).json({
					error: 'There was an error while saving the Bear to the Database'
				})
			});
		}
});

server.get('/api/bears', (req, res) => {
	Bear.find({})
		.then((bears) => {
			res.status(200).json(bears);
		})
		.catch(() => {
			res.status(500).json({
				error: 'The information could not be retrieved.'
			});
		});
});

server.get('/api/bears/:id', (req, res) => {
	const { id } = req.params;

	Bear.findById(id)
		.then((bear) => {
			res.status(200).json(bear);
		})
		.catch((error) => {
			res.status(500).json({
				error: 'The information could not be retrieved.'
			});
		});
});

const port = process.env.PORT || 5005;

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost:27017/bears')
	.then(() => {
		server.listen(port, () => {
  			console.log(`Successfully connected to MongoDB`);
		});
	})
	.catch((error) => {
		console.log(`Database connection failed`);
	});



