/**
 * Created by Lukasz on 22.04.2016.
 */
'use strict';

angular.module('AllegroService', [])
  .controller('AllegroCtrl', function ($scope, AllegroModel) {

    var allegrosrv = this;
    var urlFromForm = '';
    var pageNumber = '';
    $scope.paginationVisible = false;

    var flag=0;
    allegrosrv.offers = [];
    allegrosrv.images = [];

    console.log("Nie ma mnie tutaj");
    console.log('jestem tutaj');

    $scope.totalItems = 0;

    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;

    function postUrlToService(url) {

      if(url) {
        $scope.emptyURL = false;
        $scope.dataLoading = true;
        $scope.printResult = null;
        urlFromForm = url;
        initCreate();

        console.log('Call postUrlToService ' + url);

        AllegroModel.postUrl(angular.extend({},
          {page: pageNumber}, url)).then(function (result) {

          allegrosrv.offers = result.data;

          console.log('Server response: ' + allegrosrv.offers);
          $scope.printResult = allegrosrv.offers;
          $scope.images = allegrosrv.offers.images;
          $scope.dataLoading = false;

          if ($scope.totalItems != $scope.printResult.pg) {
            flag = 0;
          }
          if (flag == 0) {
            $scope.totalItems = allegrosrv.offers.pg;
          }

          flag = 1;
          $scope.paginationVisible = true;

        });
      }else{
        $scope.emptyURL=true;
      }
    }

    function initCreate() {
      allegrosrv.newUrl = {url: ''};
    }

    $scope.$watch("currentPage", function(newInput, oldInput) {
      if(newInput != oldInput){
        //Do your stuff
        console.log(newInput);
        pageNumber = newInput;
        $scope.currentPage = newInput;
        postUrlToService(urlFromForm);
      }
    });

    allegrosrv.postUrlToService = postUrlToService;

  })
  .constant('ENDPOINT', 'http://localhost:8080/api/send')
  .service('AllegroModel', function ($http, ENDPOINT) {

    var service = this;

    function getUrl() {
      return ENDPOINT;
    }

    service.postUrl = function (url) {
      console.log("Post: " + url);
      return $http.post(getUrl(), url);
    };
  });
