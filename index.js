require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('node:dns');

// Basic Configuration
const port = process.env.PORT || 3000;
const shortUrl = [];
let id = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  console.log(url)
  const checkUrl = url.replace(/^https?:\/\//, "")
  console.log('check', checkUrl)
  dns.lookup(checkUrl, (err) => {
    if(err){
      return res.json({ error : "invalid url"})
    }
    ++id;
    const newUrl = {
      original_url : url,
      short_url : id
    }
    shortUrl.push(newUrl);

    return res.json(newUrl)
  })
})

app.get("/api/shorturl/:url", (req, res) => {
  const { url } = req.params;
  
  const urlRedirect = shortUrl.find(el => el.short_url == url);
  
  return res.redirect(urlRedirect.original_url)
  
} )

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
