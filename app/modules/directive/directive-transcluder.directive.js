(function() {
	'use strict';

	angular
		.module('directive')
	  	.directive('directiveTranscluder', directiveTranscluder);

	/*
		TODO: What do i do
	 */

	/* @ngInject */
	function directiveTranscluder() {
		/**
		 * @ngdoc directive
		 * @name ncAngularApp.directive:directiveTranscluder
		 * @description
		 * # directiveTranscluder
		 */
		var directive = {
			link: link
		};

		return directive;

		function link(scope, element, attrs, controller, $transclude){
			$transclude(scope.$parent, function(clone) {
				element.empty();
				element.append(clone);
			});
		};
	};
})();
