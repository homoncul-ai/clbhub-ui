const path = require('path');
const express = require('express');
const app = express();
const kcName = 'trutesta-hccl-mdb5-ui';
const kcApplicationPath = '/';
const distDir = path.join(__dirname, 'dist', kcName);
const publicDir = path.join(__dirname, 'public');
const publicSurveysDir = path.join(publicDir, 'surveys');
const distSurveysDir = path.join(distDir, 'public', 'surveys');

app.use(express.json({ limit: '1mb' }));

// Run the app by serving the static files    test for blank commit
// in the dist directory
app.use(kcApplicationPath, express.static(distDir));

// Serve public files without authentication (supports nested files under /public/*).
// Prefer built assets when present, then fall back to source public folder.
app.use('/public', express.static(path.join(distDir, 'public')));
app.use('/public', express.static(publicDir));
app.use('/surveys', express.static(distSurveysDir));
app.use('/surveys', express.static(publicSurveysDir));

function getServiceUrlPrefix() {
  return process.env.HCCL_SERVICE_URL_PREFIX || 'http://localhost:8099/trutesta-hccl-services';
}

// Survey endpoint accepts payload like { surveyData: { ... } }.
app.post('/public/survey', async function (req, res) {
  const surveyData = req.body && req.body.surveyData;
  if (!surveyData || typeof surveyData !== 'object' || Array.isArray(surveyData)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid payload. Expected { surveyData: { ... } }',
    });
  }

  const body = {
    surveyCode: surveyData.surveyCode || 'npo_job_finder',
    subject: surveyData.subject || 'Survey: Do you have a job for me?',
    emailFrom: surveyData.email || surveyData.emailFrom || '',
    mapJsonData: surveyData,
  };

  try {
    // Match frontend HcclService.saveSurveyResponse() endpoint contract.
    const serviceUrl = getServiceUrlPrefix() + '/hccl/public/survey/save';
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      return res.status(response.status).json({
        status: 'error',
        message: payload.message || 'Survey save failed in backend service.',
        backend: payload,
      });
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Survey received',
      backend: payload,
    });
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: error && error.message ? error.message : 'Unable to reach survey backend service.',
    });
  }
});

// Proxy all /trutesta-hccl-services/ requests to the Java backend.
app.all('/trutesta-hccl-services/*', async function (req, res) {
  const serviceUrl = getServiceUrlPrefix() + req.path.replace('/trutesta-hccl-services', '');
  try {
    const headers = { 'Accept': req.headers['accept'] || 'application/json' };
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    const fetchOpts = { method: req.method, headers: headers };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOpts.body = JSON.stringify(req.body);
    }

    const response = await fetch(serviceUrl, fetchOpts);
    const contentType = response.headers.get('content-type') || '';
    res.status(response.status);
    if (contentType.includes('json')) {
      const payload = await response.json();
      res.json(payload);
    } else {
      const text = await response.text();
      res.set('Content-Type', contentType);
      res.send(text);
    }
  } catch (error) {
    res.status(502).json({
      status: 'error',
      message: error && error.message ? error.message : 'Unable to reach backend service.',
    });
  }
});

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

// Survey routes.
app.get(['/surveys/npo_job_finder', '/surveys/npo_job_finder/'], function (req, res) {
  const builtPath = path.join(distSurveysDir, 'npo_job_finder.html');
  res.sendFile(builtPath, function (distErr) {
    if (distErr) {
      res.sendFile(path.join(publicSurveysDir, 'npo_job_finder.html'));
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
