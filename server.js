const path = require('path');
const express = require('express');
const app = express();
const kcName = 'trutesta-hccl-mdb5-ui';
const kcApplicationPath = '/hccl/';

// Run the app by serving the static files
// in the dist directory
app.use(kcApplicationPath, express.static(__dirname + '/dist/' + kcName));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('*', function (req, res) {
  if (req.originalUrl == '/assets/servicemanifest.json') {
    res.sendFile(
      path.join(__dirname + '/dist/' + kcName + '/assets/servicemanifest.json')
    );
  } else {
    res.sendFile(path.join(__dirname + '/dist/' + kcName + '/index.html'));
  }
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);
