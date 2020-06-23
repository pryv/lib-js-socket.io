const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		'pryv-socket.io': './src/browser-index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map'
};