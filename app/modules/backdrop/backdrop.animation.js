(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.backdrop', directiveAnimation);

	/* @ngInject */
	function directiveAnimation() {

		return {
			beforeEnter: function(element, done) {
				console.log('backdrop before enter');
				// Before we trigger the entrance animation, but after the directive is added to the DOM.
				TweenMax.set(element, {
					opacity: 0,
					onComplete: done
				});
			},
			enter: function(element, done) {
				console.log('backdrop enter');
				// Triggered when done callback is fired from beforeEnter
				TweenMax.to(element, 5, {
					opacity: 1,
					onComplete: done
				});
			},
			leave: function(element, done) {
				console.log('backdrop leave');
				// Triggered when done callback is fired from beforeLeave (NYI)
				TweenMax.to(element, 1, {
					opacity: 0,
					onComplete: done
				});
			}
		};
	}
})();
