(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ncAngularApp.controller:DirectiveCtrl
	 * @description
	 * # DirectiveCtrl
	 * Controller of the ncAngularApp
	 */
	angular
		.module('directive')
		.controller('DirectiveController', Directive);

	/* @ngInject */
	function Directive() {
		/*jshint validthis: true */
		var vm = this;

		vm.controllerFunction = controllerFunction();

		function controllerFunction() {
			//console.log('Internal directive controller');
		}
	};

})();
