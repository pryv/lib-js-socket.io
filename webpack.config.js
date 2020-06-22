const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		'pryv-socket.io': './src/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PryvSocket'
	},
	devtool: 'source-map'
};