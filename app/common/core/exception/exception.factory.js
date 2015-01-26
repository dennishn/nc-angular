(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name core.factory:Exception
	 * @description
	 * # Exception
	 * Factory of the core
	 */
	angular
		.module('core.exception')
		.factory('exception', exception);

	/* @ngInject */
	function exception(logger) {

		var service = {
			catcher: catcher
		};
		return service;

		function catcher(message) {
			return function(reason) {
				logger.error(message, reason);
			};
		}

	};

})();
