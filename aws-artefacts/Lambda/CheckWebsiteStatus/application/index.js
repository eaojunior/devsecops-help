'use strict'

const { cloudWatchParams } = require('./add-metrics')
const checkTime = require('./checktime')
const sendRequest = require('./send-request')
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});

const addresses = [
  {
    ssl: true,
    proxy: false, // {host: 'host', port: 9999, user: 'user', pass: 'pass'}
    host: 'app.agilize.com.br',
    path: '/api/v1/banks',
    method: 'GET',
    name: 'client-api-agilize',
    statusOk: [200],
    time: '* * * * * *'
  },
  {
    ssl: true,
    proxy: false,
    host: 'app.agilize.com.br',
    path: '/',
    method: 'GET',
    name: 'client-app-agilize',
    statusOk: [200],
    time: '* * * * * *'
  },
  {
    ssl: true,
    proxy: false,
    host: 'ops.agilize.com.br',
    path: '/api/v1/banks',
    method: 'GET',
    name: 'operador-api-agilize',
    statusOk: [200],
    time: '* * * * * *'
  },
  {
    ssl: true,
    proxy: false,
    host: 'ops.agilize.com.br',
    path: '/',
    method: 'GET',
    name: 'operador-app-agilize',
    statusOk: [200],
    time: '* * * * * *'
  },
  {
		ssl: true,
		proxy: false, // {host: 'host', port: 9999, user: 'user', pass: 'pass'}
		host: 'cav.receita.fazenda.gov.br',
		path: '/autenticacao/login',
		method: 'GET',
		name: 'receita-ecac',
		statusOk: [200],
		time: '*/30 * * * * *'
	},
	{
		ssl: true,
		proxy: false, // {host: 'host', port: 9999, user: 'user', pass: 'pass'}
		host: 'nfse.salvador.ba.gov.br',
		path: '/default.aspx',
		method: 'GET',
		name: 'nota-salvador',
		statusOk: [200],
		time: '* * * * * *'
	},
]

const handler = () => {

	const races = []

	for (let i = addresses.length - 1; i >= 0; i--) {
		let options = addresses[i]

		let dateTime = new Date()

		if (checkTime(options.time)) {
			console.log('Check ' + options.name + '.');
			const req = sendRequest(options)
			races.push(req)
		}
	}

	Promise.all(races)
		.then((success) => {
			cw.putMetricData(cloudWatchParams, function(err, data) {
			  if (err) {
			    console.log("Error", err);
			  } else {
			    console.log("Success", JSON.stringify(data));
			  }
			  process.exit(0);
			});
		})
		.catch((error) => {
			cw.putMetricData(cloudWatchParams, function(err, data) {
			  if (err) {
			    console.log("Error", err);
			  } else {
			    console.log("Success", JSON.stringify(data));
			  }
			  process.exit(0);
			});
		})
		
}

//handler()