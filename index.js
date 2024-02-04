require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrl = [];
const shortUrl = [];
let i=0;

app.post('/api/shorturl', function(req, res){
  const url = req.body.url;
  const foundOriginalIndex = originalUrl.indexOf(url);
  console.log(foundOriginalIndex);

  if(!url.includes('http://') && !url.includes('https://')){
    res.json({error: 'invalid url'});
  }else{
    if(foundOriginalIndex < 0){
      originalUrl.push(url);
      shortUrl.push(i+1);
      console.log(shortUrl[i]);
      res.json({ original_url: url, short_url: shortUrl[i]});
      i++;
      console.log(i);
    }else{
    res.json({ original_url: url, short_url: shortUrl[foundOriginalIndex]});
    }
  }
  
  /*this is another way to do it:
  app.post('/api/shorturl', function(req, res){
    const url = req.body.url;
    const foundOriginalIndex = originalUrl.indexOf(url);
    const { hostname } = new URL(url);
    dns.lookup(hostname, (err, address, family) =>{
      if(err){
        res.json({error: 'invalid'});
      }else{
        if(foundOriginalIndex < 0){
          originalUrl.push(url);
          shortUrl.push(i);
          console.log(shortUrl[i]);
          res.json({ original_url: url, short_url: shortUrl[i]});
          i++;
          console.log(i);
        } else{
          res.json({ original_url: url, short_url: foundOriginalIndex });
        }
      }
    });
  });*/

});

app.get('/api/shorturl/:short', function(req, res){
  const short = parseInt(req.params.short);
  console.log(short);
  const foundIndex = shortUrl.indexOf(short);
  console.log(foundIndex);
  
  if(foundIndex < 0){
    return res.json({error: 'no short url found'});
  }
  else{
    res.redirect(originalUrl[foundIndex]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
