const http = require('http')
const https = require('https')

const {addMetricData} = require('./add-metrics')

module.exports = (_options) => {
	let options = {
		host: _options.host,
		path: _options.path	
	}

	if (_options.proxy) {
		let proxy = _options.proxy
		options = {
			host: proxy.host,
			port: proxy.port,
			path: (proxy.ssl ? 'https://' : 'http://') + _options.host + _options.path,
			headers: {
				'Proxy-Authorization': 'Basic ' + Buffer.from(proxy.user + ':' + proxy.pass).toString('base64')
			}
		}
	}

	console.log(options)

	let request = null

	if (_options.ssl) {
		console.log('HTTPS')
		request = https.request(options)
	} else {
		console.log('HTTP')
		request = http.request(options)
	}

	request.end()

	return new Promise(
		resolve => {
			request.on('response', (res) => {
				console.log(res.statusCode)
				let connected = _options.statusOk.indexOf(res.statusCode) >= 0;

				addMetricData(_options.name, connected ? 1 : 0)

				resolve(true)
			})
		},
		reject => {
			addMetricData(_options.name, 0)
			resolve(false)
		}
	)
}