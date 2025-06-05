// 1. Load the Express library
const express = require('express');
const path = require('path');
// 2. Create your Express app
const app = express();

// 3. Choose a port to run the server on
const PORT = 3000;

// 4. Middleware: allow parsing JSON in request bodies
app.use(express.json());

// 5. Middleware: allow parsing form submissions (not used here, but good to know)
app.use(express.urlencoded({ extended: true }));

// 6. Temporary in-memory database
const urlDatabase = {}; 

// 7. Function to generate random 6-character codes
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 8. POST route: accepts a long URL and returns a short version
app.post('/shorten', (req, res) => {
  const { long_url } = req.body; // extract "long_url" from the JSON sent in the request

  // Validate: check if user sent a URL
  if (!long_url) {
    return res.status(400).send('Error: long_url is required');
  }

  // Generate short code and store it
  const shortCode = generateShortCode();
  urlDatabase[shortCode] = long_url;

  // Respond with the full short URL
  res.send({
    short_url: `http://localhost:${PORT}/${shortCode}`,
    message: "Short URL created successfully"
  });
});


// 9. GET route: redirect to original URL using the short code
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode; // get the part after "/" from the URL
  const long_url = urlDatabase[shortCode]; // look up the original URL

  if (long_url) {
    res.redirect(long_url); // send browser to the real URL
  } else {
    res.status(404).send('Error: Short URL not found');
  }
});

// 10. Start the server
app.listen(PORT, () => {
  console.log(`URL shortener running at http://localhost:${PORT}`);
});
