
// These tests expect the DOM to contain a presentation
// with the following slide structure:
//
// 1
// 2 - Three sub-slides
// 3 - Three fragment elements
// 4


Reveal.addEventListener( 'ready', function() {


	// ---------------------------------------------------------------
	// API TESTS

	QUnit.module( 'API' );

	test( 'Reveal.isReady', function() {
		strictEqual( Reveal.isReady(), true, 'returns true' );
	});

	test( 'Reveal.isOverview', function() {
		strictEqual( Reveal.isOverview(), false, 'false by default' );

		Reveal.toggleOverview();
		strictEqual( Reveal.isOverview(), true, 'true after toggling on' );

		Reveal.toggleOverview();
		strictEqual( Reveal.isOverview(), false, 'false after toggling off' );
	});

	test( 'Reveal.isPaused', function() {
		strictEqual( Reveal.isPaused(), false, 'false by default' );

		Reveal.togglePause();
		strictEqual( Reveal.isPaused(), true, 'true after pausing' );

		Reveal.togglePause();
		strictEqual( Reveal.isPaused(), false, 'false after resuming' );
	});

	test( 'Reveal.isFirstSlide', function() {
		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );

		Reveal.slide( 1, 0 );
		strictEqual( Reveal.isFirstSlide(), false, 'false after Reveal.slide( 1, 0 )' );

		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.isLastSlide', function() {
		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		Reveal.slide( lastSlideIndex, 0 );
		strictEqual( Reveal.isLastSlide(), true, 'true after Reveal.slide( ', 0+ lastSlideIndex +' )' );

		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.getIndices', function() {
		var indices = Reveal.getIndices();

		ok( typeof indices.hasOwnProperty( 'h' ), 'h exists' );
		ok( typeof indices.hasOwnProperty( 'v' ), 'v exists' );
		ok( typeof indices.hasOwnProperty( 'f' ), 'f exists' );

		Reveal.slide( 1, 0 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 0, 'h 1, v 0' );

		Reveal.slide( 1, 2 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 2, 'h 1, v 2' );

		Reveal.slide( 0, 0 );
	});

	test( 'Reveal.getSlide', function() {
		var firstSlide = document.querySelector( '.reveal .slides>section:first-child' );

		equal( Reveal.getSlide( 0 ), firstSlide, 'gets correct first slide' );

		strictEqual( Reveal.getSlide( 100 ), undefined, 'returns undefined when slide can\'t be found' );
	});

	test( 'Reveal.getPreviousSlide/getCurrentSlide', function() {
		Reveal.slide( 0, 0 );
		Reveal.slide( 1, 0 );

		var firstSlide = document.querySelector( '.reveal .slides>section:first-child' );
		var secondSlide = document.querySelector( '.reveal .slides>section:nth-child(2)>section' );

		equal( Reveal.getPreviousSlide(), firstSlide, 'previous is slide #0' );
		equal( Reveal.getCurrentSlide(), secondSlide, 'current is slide #1' );
	});

	test( 'Reveal.getScale', function() {
		ok( typeof Reveal.getScale() === 'number', 'has scale' );
	});

	test( 'Reveal.getConfig', function() {
		ok( typeof Reveal.getConfig() === 'object', 'has config' );
	});

	test( 'Reveal.configure', function() {
		strictEqual( Reveal.getConfig().loop, false, '"loop" is false to start with' );

		Reveal.configure({ loop: true });
		strictEqual( Reveal.getConfig().loop, true, '"loop" has changed to true' );

		Reveal.configure({ loop: false, customTestValue: 1 });
		strictEqual( Reveal.getConfig().customTestValue, 1, 'supports custom values' );
	});

	test( 'Reveal.availableRoutes', function() {
		Reveal.slide( 0, 0 );
		deepEqual( Reveal.availableRoutes(), { left: false, up: false, down: false, right: true }, 'correct for first slide' );

		Reveal.slide( 1, 0 );
		deepEqual( Reveal.availableRoutes(), { left: true, up: false, down: true, right: true }, 'correct for vertical slide' );
	});

	test( 'Reveal.next', function() {
		Reveal.slide( 0, 0 );

		// Step through the vertical child slides
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 0, f: undefined } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 1, f: undefined } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 2, f: undefined } );

		// There's fragments on this slide
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 3 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 3, v: 0, f: undefined } );

		// We're at the end, this should have no effect
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 3, v: 0, f: undefined } );
	});


	// ---------------------------------------------------------------
	// FRAGMENT TESTS

	QUnit.module( 'Fragments' );

	test( 'Sliding to fragments', function() {
		Reveal.slide( 2, 0, 0 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'Reveal.slide( 2, 0, 0 )' );

		Reveal.slide( 2, 0, 2 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'Reveal.slide( 2, 0, 2 )' );

		Reveal.slide( 2, 0, 1 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'Reveal.slide( 2, 0, 1 )' );
	});

	test( 'Stepping through fragments', function() {
		Reveal.slide( 2, 0, 0 );

		// forwards:

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'next() goes to next fragment' );

		Reveal.right();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'right() goes to next fragment' );

		Reveal.down();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 3 }, 'down() goes to next fragment' );

		Reveal.down(); // moves to f #3

		// backwards:

		Reveal.prev();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'prev() goes to prev fragment' );

		Reveal.left();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'left() goes to prev fragment' );

		Reveal.up();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'left() goes to prev fragment' );
	});

	asyncTest( 'fragmentshown event', function() {
		expect( 2 );
		start();

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'fragmentshown', _onEvent );

		Reveal.slide( 2, 0 );
		Reveal.slide( 2, 0 ); // should do nothing
		Reveal.slide( 2, 0, 0 ); // should do nothing
		Reveal.next();
		Reveal.next();
		Reveal.prev(); // shouldn't fire fragmentshown

		Reveal.removeEventListener( 'fragmentshown', _onEvent );
	});

	asyncTest( 'fragmenthidden event', function() {
		expect( 2 );
		start();

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'fragmenthidden', _onEvent );

		Reveal.slide( 2, 0, 2 );
		Reveal.slide( 2, 0, 2 ); // should do nothing
		Reveal.prev();
		Reveal.prev();
		Reveal.next(); // shouldn't fire fragmenthidden

		Reveal.removeEventListener( 'fragmenthidden', _onEvent );
	});


	// ---------------------------------------------------------------
	// CONFIGURATION VALUES

	QUnit.module( 'Configuration' );

	test( 'Controls', function() {
		var controlsElement = document.querySelector( '.reveal>.controls' );

		Reveal.configure({ controls: false });
		equal( controlsElement.style.display, 'none', 'controls are hidden' );

		Reveal.configure({ controls: true });
		equal( controlsElement.style.display, 'block', 'controls are visible' );
	});

	test( 'Progress', function() {
		var progressElement = document.querySelector( '.reveal>.progress' );

		Reveal.configure({ progress: false });
		equal( progressElement.style.display, 'none', 'progress are hidden' );

		Reveal.configure({ progress: true });
		equal( progressElement.style.display, 'block', 'progress are visible' );
	});

	test( 'Loop', function() {
		Reveal.configure({ loop: true });

		Reveal.slide( 0, 0 );

		Reveal.left();
		notEqual( Reveal.getIndices().h, 0, 'looped from start to end' );

		Reveal.right();
		equal( Reveal.getIndices().h, 0, 'looped from end to start' );

		Reveal.configure({ loop: false });
	});


	// ---------------------------------------------------------------
	// EVENT TESTS

	QUnit.module( 'Events' );

	asyncTest( 'slidechanged', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
			start();
		}

		Reveal.addEventListener( 'slidechanged', _onEvent );

		// Should trigger the event
		Reveal.slide( 1, 0 );

		// Should not trigger an event since it's the same #
		Reveal.slide( 1, 0 );

		Reveal.removeEventListener( 'slidechanged', _onEvent );

	});


} );

Reveal.initialize();

