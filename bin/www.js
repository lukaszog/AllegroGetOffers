var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request').defaults({jar: true});
var async = require('async');
var item = require('../modules/item');
var functions = require('../modules/functions');

require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});


var port = process.env.PORT || 8080;

var router = express.Router();



router.route('/send')
  .post(function(req, res){

      console.log("jest jakis post");
      console.log(req.body.url);

      var url = req.body.url;
      var pageNumber = req.body.page;
      var pagesFromLink = '';
      var items = [];
      var images = [];
      var k=0;
      var q = async.queue(function(task, callback){

            console.log(task.url);
            if(task.url.length>=1) {


              if (functions.isUrl(task.url)) {
                console.log('OK');


                request(task.url, function(err, resp, body){

                  if(body) {

                    $ = cheerio.load(body);
                    links = $('div.offer-info');
                    pages = $('li.quantity');
                    pagesFromLink = $(pages).find('a.last').text();

                    element = $('.offer-photo');

                    $(element).each(function(i,image){
                      var data    = $(image).find('a').attr('data-src');
                      images[i] = data;
                    });

                    $(links).each(function (i, link) {


                      $(link).find('span.statement *').remove();
                      var price = $(link).find('span.offer-buy-now').text().trim();
                      items[k] = items[k] || [];
                      items[k] = new item.itemParam($(link).find('a.offer-title').text(),
                      price,$(link).find('a.offer-title').attr('href'), k, images[k]);
                      k++;

                    });
                    console.log("Skonczylem===================================");
                  }else{
                    console.log("There is no body");
                    console.log(err);
                  }
                  callback();
                });

              } else {
                functions.errorHandling(res, 401,"Invalid url");
              }
            }else{
                functions.errorHandling(res, 401,"Invalid url");
            }
        }
      );

      if(pageNumber){
        q.push({url: url + '&p='+pageNumber});
      }else {
        q.push({url: url + '&p=1'});
      }
      q.drain = function(errr, p) {
      console.log('All items have been processed' + items.length);
      var pages = pagesFromLink * 10;

      res.send({offers: items, pg: pages, noPage: pageNumber});
      };
  });

app.use('/api',router);
app.listen(port);
console.log('Magic ' + port);
