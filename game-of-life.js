var fps = 60;
var w = 72;
var h = 72
var size = 10;
var r = 0;

var game_canvas;
var ctx;
var table = [];

/* util */

function util_tablecopy(table) {
    var copy = [];
    for (var i = 0; i < table.length; i++)
        copy[i] = table[i].slice();
    return copy
}

/* GOL logic */

function random_table() {
	table = [];
	for (var i = 0; i < w; i++) {
		var row = [];
		for (var j = 0; j < h; j++)
			row[j] = Math.random() > 0.5;
		table[i] = row;
    }
    return table;
}

function get_neighbors(table, i, j) {
    var directions = [
        { x: 0, y: -1 }, 
        { x: -1, y: -1 }, 
        { x: -1, y: 0 }, 
        { x: -1, y: 1 }, 
        { x: 0, y: 1 }, 
        { x: 1, y: 1 }, 
        { x: 1, y: 0 }, 
        { x: 1, y: -1 }
    ];

    return directions.reduce((r, { x, y }) => {
        x += i;
        y += j;
        return r + (x in table && table[x][y] || 0);
    }, 0);
}

function life_iterate_table(table) {
	var tmp = util_tablecopy(table);
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			var n = get_neighbors(tmp, y, x);
			if (tmp[y][x]) {
				if (n < 2)
					table[y][x] = false;
				if (n == 2 || n == 3)
					table[y][x] = true;
				if (n > 3)
					table[y][x] = false;
			}
			else {
				if (n == 3)
					table[y][x] = true
			}
		}
	}
}

/* Render */

function draw_pixel(x, y) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x*size, y*size, size, size);
}

function draw_table(table){
	for(var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			if (table[y][x]){
				draw_pixel(x, y);
			}
		}
	}
}

function flush() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, size*w, size*h);
}

function gol_render(t) {
	flush();
	
	var f = Math.floor((fps/1000) * t);
	
	for (var i = 0; i < Math.min(f-r, 5); i++)
		life_iterate_table(table);
	
	r = f;
	
	draw_table(table);

	window.requestAnimationFrame(gol_render);
}

/* init */

function gol_init() {
	canvas = document.querySelector("#game-canvas");
	ctx = canvas.getContext("2d");
	table = random_table();
	window.requestAnimationFrame(gol_render);
}

window.addEventListener('load', function () {
	gol_init();
})
