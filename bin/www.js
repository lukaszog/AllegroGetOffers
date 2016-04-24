var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;

var router = express.Router();

function isURL(str) {

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  return str.match(regex);
}

function errorHandling(res, status, message)
{
  res.json({
    "status": status,
    "message": message
  });
}

function itemParam(name, price, url, id){
  this.name = name
  this.price = price
  this.id = id
  this.url = url
}

router.route('/send')
  .post(function(req, res){

      var url = req.body.url;
      var items = [];
      var k=0;
      var q = async.queue(function(task, callback){

            console.log(task.url);
            if(task.url.length>=1) {

              if (isURL(task.url)) {
                console.log('OK');


                request(task.url, function(err, resp, body){

                  if(body) {
                    $ = cheerio.load(body);
                    links = $('div.offer-info');

                    $(links).each(function (i, link) {

                      console.log($(link).find('a.offer-title').attr('href'));
                      $(link).find('span.statement *').remove();
                      var price = $(link).find('span.offer-buy-now').text().trim();
                      console.log(price);
                      items[k] = items[k] || [];
                      items[k] = new itemParam($(link).find('a.offer-title').text(),
                        price,$(link).find('a.offer-title').attr('href'), k);
                      k++;

                    });

                  }
                  callback();
                });

              } else {
                errorHandling(res, 401,"Invalid url");
              }
            }else{
                errorHandling(res, 401,"Invalid url");
            }
        }
      );

      for(var i=1; i<2; i++) {
        q.push({url: url + '&p='+i});
      }
      q.drain = function(errr, p) {

        for (var i=0; i<items.length; i++) {

          console.log(items[i].name + ' |  ' + items[i].id + ' | ' + items[i].price + ' | ' + items[i].url);

        }
        console.log('all items have been processed' + items.length);
        res.sendStatus(200);
      };
  });

app.use('/api',router);
app.listen(port);
console.log('Magic ' + port);
