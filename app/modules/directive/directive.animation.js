(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.directive', directiveAnimation);

	/* @ngInject */
	function directiveAnimation() {
		console.log('directiveAnimation')
		return {
			beforeEnter: function(element, done) {

				TweenMax.set(element, {
					y: '100%',
					onComplete: done
				});

			},
			enter: function(element, done) {
				console.log('enter');
				TweenMax.to(element, 1, {
					y: '0%',
					onComplete: done,
					ease: Bounce.easeOut
				});
			},
			leave: function(element, done) {
				console.log('leave');
				TweenMax.to(element, 1, {
					y: '-100%',
					onComplete: done,
					ease: Circ.easeOut
				});
			}
		};
	};
})();
