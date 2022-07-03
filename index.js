const express = require('express');
const app = express();
const fs = require('fs');

const { join } = require('path')
const canvaslib = require('@napi-rs/canvas')

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
	var imageurl = "https://canvastest.angeldc943.repl.co/assets/simple.png"
	if (!req.query.disabled) imageurl = 'https://canvastest.angeldc943.repl.co/image?hats='+req.query.hats

	var htmlpage = fs.readFileSync('./index.html').toString();
	htmlpage = htmlpage.replace(/¡avatarurl/g, imageurl);
	
	res.send(htmlpage);
})

app.get('/image', async (req, res) => {
	const hatdata = JSON.parse(fs.readFileSync('./hats.json', 'utf8'));
	console.log(hatdata[0])

	var offset = [0,0]
	var zoom = 1
	const width = 350;
	const height = 350;
	if (req.query.offset) offset = req.query.offset.split(",")
	if (req.query.zoom) zoom = parseFloat(req.query.zoom)
	
	const canvas = canvaslib.createCanvas(width, height)
	const context = canvas.getContext('2d')
	
	// Create background
	var grd = context.createLinearGradient(0, -height, 0, height*2);
	grd.addColorStop(0, "#1e1e1e");
	grd.addColorStop(1, "#181a21");
	context.fillStyle = grd;
	context.fillRect(0, 0, width, height);

	// load head
	var headimg = await canvaslib.loadImage('./assets/head.png')		
	context.drawImage(headimg, parseInt(offset[0]), parseInt(offset[1]), width*(zoom), height*(zoom));

	// load hats
	var hats = req.query.hats.split(",")
	console.log(hats)
	var hat_toload = []
	for (var x = 0; x < hats.length; x++) {
		var hat = hatdata[parseInt(hats[x])-1]
		
		if (hat) hat_toload.push(hat);

	}
	
	hat_toload.sort((a,b) =>{
		return a.priority - b.priority
	})
	
	for (var i = 0; i < hat_toload.length; i++) {
		var image = await canvaslib.loadImage(hat_toload[i].url) // load image
		context.drawImage(image, parseInt(offset[0]), parseInt(offset[1]), width*(zoom), height*(zoom));
	}
	
	async function save() {
		const pngData = await canvas.encode('png') // JPEG and WebP is also supported
		// encoding in libuv thread pool, non-blocking
		fs.writeFile(join(__dirname, './assets/simple.png'), pngData, err => {
			if (err) console.log(err)
		})
	}
	
		
	res.writeHead(200,{"Content-Type": "image/png"});
	res.end(canvas.toBuffer("image/png"));
	//save()
})//*/

app.listen(3000, () => {
  console.log('server started');
});
