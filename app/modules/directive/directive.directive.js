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

		function link(scope, element, attrs){
			console.log(scope.animate)

			element.addClass(attrs.directiveClass || '');

			// Animation?!
			element.on('click', function(event) {
				scope.close(event);
			});

			$timeout(function() {
				//scope.animate = true;

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
				var directive = DirectiveFactory.getTop();
				if (directive && (event.target === event.currentTarget)) {
					event.preventDefault();
					event.stopPropagation();
					DirectiveFactory.dismiss(directive.key, 'click outside');
				}
			}
		};
	};
})();
