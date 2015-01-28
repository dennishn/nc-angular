(function() {
	'use strict';

	angular
		.module('directive')
	  	.directive('directive', Directive);

	/* @ngInject */
	function Directive($timeout, $animate, DirectiveFactory) {
		/**
		 * @ngdoc directive
		 * @name ncAngularApp.directive:directiveContainer
		 * @description
		 * # Directive
		 */
		var directive = {
			restrict: 'EA',
			scope: {
				index: '@',
				animate: '='
			},
			replace: true,
			transclude: true,
			templateUrl: function(tElement, tAttrs) {
				return tAttrs.templateUrl || 'modules/directive/directive.template.html';
			},
			link: link
		};

		return directive;

		function link(scope, element, attrs, controller){

			console.log(controller);

			// I can take additional consumer-provided custom css classes.
			element.addClass(attrs.directiveClass || '');

			// Animation?!
			// Can i be closed by specific actions?
			element.on('click', function(event) {
				scope.close(event);
			});

			// We should wait for any animations to complete before doing some operations
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
					element[0].focus();
				}
			});

			scope.close = function(event) {

				// When a user clicks "outside" of the directive, we check if this specific instance
				// is the next-to-be-removed instance in the LIFO stack. If this directive is next in line,
				// we cancel any events, and dismiss (promise.reject) this directive.

				var directive = DirectiveFactory.getTop();
				if (directive && (event.target === event.currentTarget)) {
					event.preventDefault();
					event.stopPropagation();
					DirectiveFactory.dismiss(directive.key, 'click outside');
				}
			}
		};
	};

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
