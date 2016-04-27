/**
 * Created by Lukasz on 22.04.2016.
 */
'use strict';

angular.module('AllegroService', [])
.controller('AllegroCtrl', function($scope, AllegroModel){

  var allegrosrv = this;
  allegrosrv.offers = [];

  console.log("Jestem tutaj");

  function postUrlToService(url){

    initCreate();
    console.log("wywoluje funkcje postUrl " + url);

    AllegroModel.postUrl(url).then(function (result){

      allegrosrv.offers = result.data;
      console.log("Odpowiedz z serwera: " + allegrosrv.offers);
      $scope.printResult = allegrosrv.offers;

    })
  }

  function initCreate(){
    allegrosrv.newUrl = { url: ''};
  }

  allegrosrv.postUrlToService = postUrlToService;

})
.constant('ENDPOINT', 'http://localhost:8080/api/send')
.service('AllegroModel', function($http, ENDPOINT) {

    var service = this;

    function getUrl() {
      return ENDPOINT;
    }

    service.postUrl = function (url) {
      console.log("robie post: " + url);
      return $http.post(getUrl(),url);
    };
});
