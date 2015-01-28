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

		activate();

		function activate() {
			console.log('Directive Controller started');
		};

		function controllerFunction() {
			console.log('I was triggered by calling the DirectiveController function "controllerFunction()"');
		}
	};

})();
