/**
 * Created by Lukasz on 22.04.2016.
 */
'use strict';

angular.module('AllegroService', [])
.controller('AllegroCtrl', function($scope, AllegroModel){


  var allegroctrl = this;
  var offersdata = [];

  function postUrl(url){
    AllegroModel.postUrl(url).then(function (result){

      allegroctrl.offers = result.data;

      console.log("Odpowiedz z serwera: " + allegroctrl.offers);


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
