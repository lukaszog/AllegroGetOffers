'use strict';

/**
 * @ngdoc overview
 * @name allegroapiApp
 * @description
 * # allegroapiApp
 *
 * Main module of the application.
 */
angular
  .module('allegroapiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'AllegroService',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'AllegroCtrl',
        controllerAs: 'allegrosrv'
      })
      .when('/page/:currentPage', {
        templateUrl: 'views/main.html',
        controller: 'AllegroCtrl',
        controllerAs: 'allegrosrv'

      })
      .otherwise({
        redirectTo: '/'
      });
})



