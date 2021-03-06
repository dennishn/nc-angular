(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ncAngularApp.factory:Directive
	 * @description
	 * # Directive
	 * Factory of the directive
	 * A factory is the basic building block of the individual types of
	 * dynamically created directives.
	 */
	angular
		.module('directive')
		.factory('DirectiveFactory', DirectiveFactory);

	/* @ngInject */
	function DirectiveFactory(Lifo, $timeout, $document, $compile, $rootScope, $animate, $$rAF) {

		// I handle the directives instances, and their position in the shared stack.
		var OPENED_CLASS = 'ng-directive-open';

		var ROOT_DIRECTIVE_MARKUP = '<div directive></div>';
		var BACKDROP_DIRECTIVE_MARKUP = '<div backdrop></div>';

		// Backdrop related
		var backdropDomEl, backdropScope;

		// Create a LIFO stack
		var openedDirectives = Lifo.createNew();

		var directive = {
			open: open,
			close: close,
			dismiss: dismiss,
			dismissAll: dismissAll,
			getTop: getTop
		};

		/*
			Private Methods
		 */
		// I return the top of the directive stacks index
		function _getBackdropIndex() {
			// Start value
			var topBackdropIndex = -1;

			// Get a list of all open directives
			var opened = openedDirectives.keys();

			// Loop through opened directives, if the backdrop is attached to this - return its index, else -1.
			for(var i = 0; i < opened.length; i++) {
				if(openedDirectives.get(opened[i]).value.backdrop) {
					topBackdropIndex = i;
				}
			}
			return topBackdropIndex;
		}
		// I watch the rootscope, for changes in the directive index stack, and update the backdrop scope accordingly
		$rootScope.$watch(_getBackdropIndex, function(newBackdropIndex) {
			if(backdropScope) {
				backdropScope.index = newBackdropIndex;
			}
		});


		// I take care of the "outside world" aswell as removing($destroying) the directive
		function _removeDirective(directiveInstance) {

			// Reference the body DOM element
			var body = $document.find('body').eq(0);

			// Get the directive from the LIFO stack
			var directiveElement = openedDirectives.get(directiveInstance).value;

			// Remove the directive from the LIFO stack
			openedDirectives.remove(directiveElement);

			// NOGET MED NG ANIMATE
			_removeAfterAnimation(directiveElement.directiveDomElement, directiveElement.directiveScope, function() {
				directiveElement.directiveScope.$destroy();
				body.toggleClass(OPENED_CLASS, openedDirectives.length() > 0);
			});
			_checkAndRemoveBackdrop();

			// Only remove the OPENED_CLASS if we're at the last entry of the LIFO stack
			body.toggleClass(OPENED_CLASS, openedDirectives.length() > 0);

		}

		function _shouldRemoveBackdrop() {

			return backdropDomEl && _getBackdropIndex == -1;

		}
		// I am used to see if the backdrop is no longer needed, in which case i remove it
		function _checkAndRemoveBackdrop() {

			if(backdropDomEl && _getBackdropIndex() == -1) {

				var backdropScopeReference = backdropScope;

				_removeWhileAnimating(backdropDomEl, function() {
					backdropScopeReference.$destroy();
					backdropScopeReference = null;
				});

				backdropDomEl = undefined;
				backdropScope = undefined;

			}

		}

		function _removeWhileAnimating(domEl, done) {
			$animate.leave(domEl).then(function() {
				done();
			});
		}
		// I run a leave animation, and fire a provided callback when the animation is done.
		function _removeAfterAnimation(domEl, scope, done) {
			$animate.leave(domEl).then(function() {
				$rootScope.$apply(function() {
					done();
				});
			});
		}

		/*
		 Global Event Handlers
		 */
		$document.bind('keydown', function(event) {
			var closeDirective;

			if(event.which === 27) {
				closeDirective = openedDirectives.top();

				if(closeDirective && closeDirective.value.closeOnEscape) {
					event.preventDefault();

					$rootScope.$apply(function() {
						directive.dismiss(closeDirective.key, 'close on escape');
					});
				}
			}
		});

		/*
			Public Methods
		 */

		// I create, compile and append a directive to the DOM
		function open(directiveInstance, directive) {

			// Add the new directive to the LIFO stack
			openedDirectives.add(directiveInstance, {
				deferred: directive.deferred,
				directiveScope: directive.scope,
				backdrop: directive.backdrop,
				closeOnEscape: directive.closeOnEscape
			});

			// Reference the body DOM element
			var body = $document.find('body').eq(0);

			// Handle backdrop...
			var currentBackdropIndex = _getBackdropIndex();

			if(currentBackdropIndex >= 0 && !backdropDomEl) {

				backdropScope = $rootScope.$new(true);
				backdropScope.index = currentBackdropIndex;
				backdropDomEl = $compile(BACKDROP_DIRECTIVE_MARKUP)(backdropScope);
				body.append(backdropDomEl);
			}

			// Create and reference the root directive element
			// MORE EXPLANATION
			var directiveRootElement = angular.element(ROOT_DIRECTIVE_MARKUP);

			// Set the directive attributes (You normally do this in the view templates, but we do it by JS because we
			// use a provider design for our directive.

			// These are all the attributes that can be one, or two way bound?!
			directiveRootElement.attr({
				'template-url': directive.directiveTemplateUrl,
				'directive-class': directive.directiveClass,
				'index': openedDirectives.length() - 1
			});
			// Append the directive content (This is perhaps transclusion?
			directiveRootElement.html(directive.content);

			// Add additional classes
			directiveRootElement.addClass(directive.directiveClass);

			// Compile the root element, add it's scope, no this is transclusion!
			var directiveDomElement = $compile(directiveRootElement)(directive.scope);

			// Add the compiled dom to the LIFO stack
			openedDirectives.top().value.directiveDomElement = directiveDomElement;

			// Append the compiled dom to the body
			body.append(directiveDomElement);

			// Add opened class to the body
			body.addClass(OPENED_CLASS);

		}

		// [resolve]
		// I close and cleanup after a directive, and resolve a promise
		function close(directiveInstance, result) {

			// Get the directive instance from the LIFO stack
			var directiveElement = openedDirectives.get(directiveInstance);

			// If we find the directive instance, we can remove it
			if(directiveElement) {
				// Resolve the promise ( .success )
				directiveElement.value.deferred.resolve(result);
				// Remove the directive
				_removeDirective(directiveInstance);
			}

		}

		// [reject]
		// I close and cleanup after a directive, and reject a promise
		function dismiss(directiveInstance, reason) {

			// Get the directive instance from the LIFO stack
			var directiveElement = openedDirectives.get(directiveInstance);

			// If we find the directive instance, we can remove it
			if(directiveElement) {
				// Resolve the promise ( .success )
				directiveElement.value.deferred.reject(reason);
				// Remove the directive
				_removeDirective(directiveInstance);
			}

		}

		// [reject all]
		// I empty the LIFO stack, clean up, and reject all promises
		function dismissAll(reason) {

			// Get the last-in instance from the LIFO stack
			var topDirective = this.getTop();

			// While there are instances in the LIFO stack, remove and reject
			while(topDirective) {
				this.dismiss(topDirective.key, reason);
				topDirective = this.getTop();
			}
		}

		// I return the last-in of the LIFO stack
		function getTop() {
			return openedDirectives.top();
		}

		return directive;
	}

})();
