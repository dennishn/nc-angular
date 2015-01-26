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
		.controller('Directive', Directive);

	/* @ngInject */
	function Directive() {
		/*jshint validthis: true */
		var vm = this;

		activate();

		function activate() {

		};
	};

})();
