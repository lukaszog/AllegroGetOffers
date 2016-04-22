/**
 * Created by Lukasz on 22.04.2016.
 */
'use strict';

angular.module('AllegroService', [])
.controller('AllegroCtrl', function($scope, AllegroModel){


  var allegroctrl = this;

  function postUrl(url){
    AllegroModel.postUrl(url).then(function (result){


    })
  }


})
.constant('ENDPOINT', 'http://localhost:9000/api/send')
.service('AllegroModel', function($http, ENDPOINT) {

    var service = this;

    function getUrl() {
      return ENDPOINT;
    }

    service.postUrl = function (url) {
      return $http.post(getUrl());
    };
});
