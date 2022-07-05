var ready = false

const width = 350;
const height = 350;

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

canvas.height = height;
canvas.width = width;

var loadedhats = {}
var headimg

var req_hatlimits;
var req_hatdata;

async function preload() {
	req_hatdata = await fetch('https://canvastest.angeldc943.repl.co/assets/hats.json');
	req_hatlimits = await fetch('https://canvastest.angeldc943.repl.co/assets/hatlimits.json');
	const hatdata = await req_hatdata.json();
	
	headimg = new Image();
	headimg.src = "https://canvastest.angeldc943.repl.co/assets/head.png"

	for (var i = 0; i < hatdata.length; i++) {
		var img = new Image();
		img.src = "https://canvastest.angeldc943.repl.co/assets/" + hatdata[i].url
		loadedhats[hatdata[i].id] = img
	}

	ready = true
	draw()
}

preload()

async function draw(hatlist,req_offset,req_zoom) {
	
	context.font = "25px Arial";
	context.fillStyle = "white";
	context.fillText("Loading", 20, 50);
	
	if (req_hatlimits) req_hatlimits = await fetch('https://canvastest.angeldc943.repl.co/assets/hatlimits.json');
	if (req_hatdata) req_hatdata = await fetch('https://canvastest.angeldc943.repl.co/assets/hats.json');
		
	const hatlimits = await req_hatlimits.json();
	const hatdata = await req_hatdata.json();
	
	var hats = []
	var offset = [0,0]
	var zoom = 1
	if (req_offset) offset = String(req_offset).split(",")
	if (req_zoom) zoom = parseFloat(String(req_zoom))
	
	// Create background
	var grd = context.createLinearGradient(0, -height, 0, height*2);
	grd.addColorStop(0, "#1e1e1e");
	grd.addColorStop(1, "#181a21");
	context.fillStyle = grd;
	context.fillRect(0, 0, width, height);
	
	// load head
	imageonload(headimg);

	async function imageonload(img)
	{
		var pos_x = parseInt(offset[0]) + ((width/2)  - ((width*zoom)/2) );
		var pos_y = parseInt(offset[1]) + ((height/2) - ((height*zoom)/2) );
		console.log(`position: ${pos_x}, ${pos_y}`)
		context.drawImage(img, pos_x, pos_y, width * zoom, height * zoom);
	}
	
	// load hats
	if (hats) hats = String(hatlist).split(",")
	var hat_toload = []
	for (var x = 0; x < hats.length; x++) {
		var hat = hatdata[parseInt(hats[x])-1]
		
		if (hat) hat_toload.push(hat);
	
	}

	hat_toload.sort((a,b) =>{
		return a.priority - b.priority
	})
	
	var loaded = {}
	for (var i = 0; i < hat_toload.length; i++) {
		
		var hattype = hat_toload[i].type
		loaded[hattype] = (loaded[hattype] ? loaded[hattype] : 0)
		
		if (loaded[hattype] < hatlimits[hattype].amount || hatlimits[hattype].limit == false) {
			imageonload(loadedhats[hat_toload[i].id])
			loaded[hattype] += 1
		}
	}
}