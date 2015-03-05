(function() {
	'use strict';

	angular
		.module('directive')
	  	.directive('directive', Directive);

	/* @ngInject */
	function Directive($document, $animate, $timeout) {
		/**
		 * @ngdoc directive
		 * @name ncAngularApp.directive:directiveContainer
		 * @description
		 * # Directive
		 */
		var controllers = ['DirectiveController'];

		var directive = {
			restrict: 'EA',
			scope: {
				index: '@'
			},
			replace: true,
			transclude: true,
			controller: 'DirectiveController',
			templateUrl: function(tElement, tAttrs) {
				return tAttrs.templateUrl || 'modules/directive/directive.template.html';
			},
			link: {
				pre: preLink,
				post: postLink
			}
		};

		return directive;

		function preLink(scope, element, attrs, controller, transclude) {

		}
		function postLink(scope, element, attrs, controller, transclude) {

			var body = $document.find('body').eq(0);

			$animate.enter(element, body, angular.element(body[0].lastChild)).then(function() {

			});

			$timeout(function() {
				/**
				 * Auto-focusing of a freshly-opened modal element causes any child elements
				 * with the autofocus attribute to lose focus. This is an issue on touch
				 * based devices which will show and then hide the onscreen keyboard.
				 * Attempts to refocus the autofocus element via JavaScript will not reopen
				 * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
				 * the modal element if the modal does not contain an autofocus element.
				 */
				if (!element[0].querySelectorAll('[autofocus]').length) {
					//element[0].focus();
				}
			});
		}

	}
})();
