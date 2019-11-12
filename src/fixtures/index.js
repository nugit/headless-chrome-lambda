
const fs = require('fs');
const path = require('path');

const nugit1 = fs.readFileSync(path.join(__dirname, 'nugit1.html'), 'utf8');
const helloWorld = fs.readFileSync(path.join(__dirname, 'helloWorld.html'), 'utf8');

module.exports = { nugit1, helloWorld };
