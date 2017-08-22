const path = require('path');

module.exports = {
    entry: {
        index: './fquery.js'
    },
    output: {
        filename: 'aw-fquery.amd.js',
        libraryTarget: "umd",
        library: 'awFquery',
        path: path.resolve(__dirname, 'dist')
    }
};