const store = {
	canvas: null,
	ctx: null,
	charSet: '0123456789ABCDEF'.split(''),
	fontSize: 12,
	drops: [],
	columns: 0,
	rows: 0,
	layerInterval: null,
	timer: 60,
	color: '#0f0',
	fillColor: 'rgba(0, 0, 0, 0.15)',
};

store.charsCount = store.charSet.length;

// Create canvas element
store.canvas = $('<canvas>')[0];
$('body').append($(store.canvas));
store.ctx = store.canvas.getContext('2d');

const reDraw = () => {
	store.ctx.fillStyle = store.fillColor;
	store.ctx.fillRect(0, 0, store.canvas.width, store.canvas.height);
	store.ctx.fillStyle = store.color;
	store.ctx.font = `${store.fontSize}px`;
};

const drop = (x, y, time) => {
	// Select random char
	const text = store.charSet[Math.floor(Math.random() * store.charsCount)];
	// Write char
	store.ctx.fillText(text, x * store.fontSize, y * store.fontSize);

	// Restart drop if needed
	if (y * store.fontSize > store.canvas.height) {
		y = Math.floor(Math.random() * store.rows) * -1;
		time = Math.floor(Math.random() * store.timer) + store.timer;
	}

	store.drops[x] = setTimeout(() => {
		drop(x, ++y, time);
	}, time);
};

const initialize = () => {

	// Making the canvas full screen
	store.canvas.height = $(document).height();
	store.canvas.width = $(document).width();

	// Number of columns for the rain
	const columns = store.columns || 0;
	store.columns = store.canvas.width / store.fontSize;
	store.rows = store.canvas.height / store.fontSize;

	// Needed to remove unwanted drops
	const i = columns > store.columns ? columns : store.columns;

	// Start drops
	for (let x = 0; x < i; x++) {
		// Remove drops out of view
		if (x>store.columns) {
			clearTimeout(store.drops[x]);
			store.drops[x] = null;
			continue;
		}

		// Don't start drops if exists
		if (store.drops[x]) {
			continue;
		}

		// Calculate initial y coordinate and timeout for the drop
		const y = Math.floor(Math.random() * store.canvas.height / store.fontSize) * -1;
		const time = Math.floor(Math.random() * store.timer) + store.timer;

		// Start drop
		store.drops[x] = setTimeout(() => {
			drop(x, y, time);
		}, time);
	}

	if (store.layerInterval) {
		clearInterval(store.layerInterval);
	}

	// Draw translucent overlay
	store.layerInterval = setInterval(reDraw, store.timer*2);
};

(function () {
	let resizeTimeout;
	$(window).on('resize orientationChange', () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		resizeTimeout = setTimeout(initialize, 200);
	}).resize();
})(window, document, jQuery);
