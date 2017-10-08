var express = require('express');
var app = express();
var fs = require('fs');

const PORT = 5001;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// =============================================================================
// fire up the server
app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  app: app
};
