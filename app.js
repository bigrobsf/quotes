var express = require('express');
var app = express();
var path = require('path');

const PORT = 5001;

var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

// =============================================================================
// fire up the server
app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  app: app
};
