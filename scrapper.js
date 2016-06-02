var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

var mongojs = require('mongojs');
var databaseUrl= 'dburlhere';
var collections= 'collectionNamehere';
var db = mongojs(databaseUrl, collections);
db.on('error',function(err){
  console.log('database error',err);
});

app.get('/',function(req,res){
  console.log('This part works');
});

app.get('/all', function(req,res){
    db.collectionNamehere.find({},function(err,found){
      if(err){
        console.log('Error');
      }else{
        res.json(found);
      }
    });
});

app.get('/scrape',function(req,res){
  request('https://www.reddit.com/r/newjersey',function(error, response, html){
    var $= cheerio.load(html);
    $('p').each(function(i,element){
      var p = $(this).children('p').text();
      var link= $(this).children('a').attr('href');

      if(p&&link){
        db.collectionNamehere.save({
          p:p,
          link:link
        }, function (err, saved){
          if(err){
            console.log(err);
          }else{
            console.log(saved);
          }
        });
      });

    });
    res.send('Scrape complete');
});
app.listen(3000,function(){
  console.log('Running onn 3000')
});
