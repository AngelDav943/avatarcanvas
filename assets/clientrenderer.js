var ready = false

const width = 350;
const height = 350;

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

canvas.height = height;
canvas.width = width;

var loadedhats = {}
var headimg

async function preload() {
	const req_hatdata = await fetch('https://canvastest.angeldc943.repl.co/assets/hats.json');
	const hatdata = await req_hatdata.json();
	
	headimg = new Image();
	headimg.src = "./assets/head.png"

	for (var i = 0; i < hatdata.length; i++) {
		var img = new Image();
		img.src = hatdata[i].url
		loadedhats[hatdata[i].id] = img
	}

	ready = true
	draw()
}

preload()

async function draw(hatlist,offset,zoom) {
	
	context.font = "25px Arial";
	context.fillStyle = "white";
	context.fillText("Loading", 20, 50);
	
	const req_hatlimits = await fetch('https://canvastest.angeldc943.repl.co/assets/hatlimits.json');
	const req_hatdata = await fetch('https://canvastest.angeldc943.repl.co/assets/hats.json');
		
	const hatlimits = await req_hatlimits.json();
	const hatdata = await req_hatdata.json();
	
	var hats = []
	var offset = [0,0]
	var zoom = 1
	if (offset) offset = String(offset).split(",")
	if (zoom) zoom = parseFloat(String(zoom))
	
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
		context.drawImage(img, parseInt(offset[0]), parseInt(offset[1]), width*(zoom), height*(zoom));
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