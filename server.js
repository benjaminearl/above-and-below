const fs = require('fs');
const express = require('express');
const app = express();
const moment = require('moment');
const EOL = require('os').EOL;


function getImages(since) {
	const skyImages = fs.readdirSync('./sky');
	const landImages = fs.readdirSync('./land');

	let response = null;
	let timestamps = [];
	skyImages.forEach((file) => {
		if (file.substr(0, 1) !== '.') {
			const filenameParts = file.split('.');
			
			timestamps.push(parseInt(filenameParts[0]));
		}
	});
	const lastTimestamp = timestamps[timestamps.length-1];

	if (!since || since < lastTimestamp) {
		const image = lastTimestamp + '.jpg';


		if (fs.existsSync('./sky/'+image)) {
			response = {
				time: lastTimestamp,
				image: image,
			};
		}

	}

	return response;
}
// getImages();
app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	data = getImages(req.query.since);
	res.json(data);
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
