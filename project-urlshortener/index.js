require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./config/mongoose');
const urlModel = require('./models/url');


const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async function(req,res){
  const url = req.body.url;
  if(!url.includes('http')){
    return res.json({error: 'invalid url'});
  }
  const count = await urlModel.countDocuments();
  await urlModel.create({
    original_url: url,
    short_url: count+1
  });
  res.json({original_url: url, short_url: count+1});
});

app.get('/api/shorturl/:shorturl', async function(req,res){
  let url = await urlModel.findOne({short_url: req.params.shorturl});
  res.redirect(url.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
   