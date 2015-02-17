(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.directive', directiveAnimation);

	/* @ngInject */
	function directiveAnimation() {

		return {
			beforeEnter: function(element, done) {

				// Before we trigger the entrance animation, but after the directive is added to the DOM.
				//console.log('before enter', element, done);
				TweenMax.set(element, {
					y: '100%',
					onComplete: done
				});
			},
			enter: function(element, done) {

				// Triggered when done callback is fired from beforeEnter
				//console.log('enter', element, done);
				TweenMax.to(element, 1, {
					y: '0%',
					onComplete: done,
					ease: Bounce.easeOut
				});
			},
			leave: function(element, done) {

				// Triggered when done callback is fired from beforeLeave (NYI)
				//console.log('leave', element, done);
				TweenMax.to(element, 1, {
					y: '-100%',
					onComplete: done,
					ease: Circ.easeOut
				});
			}
		};
	};
})();
