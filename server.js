const path = require('path');
const express = require('express');
const app = express();
const kcName = 'trutesta-hccl-mdb5-ui';
const kcApplicationPath = '/';
const distDir = path.join(__dirname, 'dist', kcName);
const publicDir = path.join(__dirname, 'public');

// Run the app by serving the static files
// in the dist directory
app.use(kcApplicationPath, express.static(distDir));

// Serve public files without authentication (supports nested files under /public/*).
// Prefer built assets when present, then fall back to source public folder.
app.use('/public', express.static(path.join(distDir, 'public')));
app.use('/public', express.static(publicDir));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/public/*', function (req, res) {
  const distPath = path.join(distDir, req.path);
  res.sendFile(distPath, function (distErr) {
    if (!distErr) {
      return;
    }

    const sourcePath = path.join(publicDir, req.path.replace(/^\/public\/?/, ''));
    res.sendFile(sourcePath, function (sourceErr) {
      if (!sourceErr) {
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  });
});

// Public landing page routes.
app.get(['/public', '/public/', '/public/index.html'], function (req, res) {
  const builtPublicIndex = path.join(distDir, 'public', 'index.html');
  res.sendFile(builtPublicIndex, function (err) {
    if (err) {
      res.sendFile(path.join(publicDir, 'index.html'));
    }
  });
});
// /onboard/student 
// /onboard/parent
app.get('*', function (req, res) {
  if (req.path == '/assets/servicemanifest.json') {
    res.sendFile(
      path.join(distDir, 'assets', 'servicemanifest.json')
    );
  } else {
    res.sendFile(path.join(distDir, 'index.html'));
  }
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);
//app.listen(process.env.PORT || 4200);
