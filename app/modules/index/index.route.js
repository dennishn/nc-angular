(function() {
  'use strict';

  /**
   * @ngdoc route
   * @name ncAngularApp.route:index
   * @function
   * @description
   * # index
   * Route in the ncAngularApp.
   */
  angular.module('ncAngularApp')
    /* @ngInject */
    .config(function ($stateProvider) {

      var Index = {
        name: 'index',
        url: '/',
        templateUrl: 'modules/index/index.template.html',
        controller: 'Index',
        controllerAs: 'index'
      };

      $stateProvider.state(Index);
    });
})();
