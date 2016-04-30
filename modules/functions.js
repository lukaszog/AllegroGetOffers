/**
 * Created by Lukasz on 30.04.2016.
 */

exports.isUrl = function(str) {

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  return str.match(regex);
};

exports.errorHandling = function(res, status, message)
{
  res.json({
    "status": status,
    "message": message
  });
};
