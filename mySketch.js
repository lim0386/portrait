var particles;
var img = []
var n, s, maxR;
var indexImg = 0;
var timer = 0;
let me = 0;

let faceapi;
let video;
let detections;
let photo;
faceCount = 0;

const detection_options = {
	withLandmarks: true,
	withDescriptors: false,
}
function preload() {
	// img.push(loadImage('KakaoTalk_20221025_034445073.png'));
	img.push(loadImage('face1.png'));
	img.push(loadImage('face2.png'));
	img.push(loadImage('face3.png'));
	img.push(loadImage('face4.png'));
	img.push(loadImage('face5.png'));
	img.push(loadImage('face6.png'));
	img.push(loadImage('face7.png'));
	img.push(loadImage('face8.png'));
	img.push(loadImage('face9.png'));
	img.push(loadImage('face10.png'));
	img.push(loadImage('face11.png'));
	img.push(loadImage('face12.png'));
	// video = createCapture(VIDEO);
	// video.size(width, height/2);
	// // video.hide(); // Hide the video element, and just show the canvas
	// faceapi = ml5.faceApi(video, detection_options, modelReady);
}
function setup() {
	createCanvas(windowWidth, windowHeight * 2);
	document.documentElement.style.overflowX = "hidden";
	document.documentElement.style.overflowY = "hidden";
	//createCanvas(1065, 1920);
	video = createCapture(VIDEO);
	video.size(width, height);
	video.hide(); // Hide the video element, and just show the canvas
	faceapi = ml5.faceApi(video, detection_options, modelReady);

	background("#FFEDDA");
	smooth();

	n = 500; //붓의 양 1000
	s = 50;  //붓 굵기 20
	maxR = height / 3 - height / 10;//전체 그림 비율

	particles = [];
}

function modelReady() {
	console.log('ready!')
	console.log(faceapi)
	faceapi.detect(gotResults)

}

function gotResults(err, result) {
	if (err) {
		console.log(err);
		return;
	}
	detections = result;
	image(video, -1 * width / 2, height / 3, width, height / 2);
	// rect(-1 * width / 2, height / 4, width, 100);
	if (detections) {
		console.log("Start");
		if (detections.length > 0) {
			photo = video;
			me = 1;
			// for (let i = 0; i < detections.length; i++) {
			// 	const alignedRect = detections[i].alignedRect;
			// 	const x = alignedRect._box._x;
			// 	const y = alignedRect._box._y + height / 3;
			// 	const boxWidth = alignedRect._box._width;
			// 	const boxHeight = alignedRect._box._height / 2;

			// 	// noFill();
			// 	// rect(x, y, boxWidth, boxHeight);
			// 	if (timer < 20) {
			// 		// photo = get(x-boxWidth/2, y-boxHeight, boxWidth*2, boxHeight*2);
			// 		photo = get(x-boxWidth, y-boxHeight, boxWidth, boxHeight);
			// 		me = 1;
			// 	}
			// }
		}
	}
	faceapi.detect(gotResults);
}

function draw() {
	console.log(timer, me);
	translate(width / 2, height / 4);
	noStroke();
	if (me === 0) {
		if (timer > 50) {
			if (s > 1) {
				if (particles.length != 0) {
					for (let i = 0; i < particles.length; i++) {
						var p = particles[i];
						p.show();
						p.move();

						if (p.isDead()) particles.splice(i, 1);
					}
				} else {
					s -= 5; //붓의 작아지는 양 원래 2
					initParticles();
				}
			}
			if (timer > 1500) {
				me = 0;
				indexImg = (indexImg + 1) % img.length;
				// background("#FFEDDA");
				n = 500; //붓의 양 1000
				s = 50;  //붓 굵기 20
				timer = 0;
			}
		}
		timer++;
	}
	if (me === 1) {
		if (timer > 50) {
			if (s > 1) {
				if (particles.length != 0) {
					for (let i = 0; i < particles.length; i++) {
						var p = particles[i];
						p.show();
						p.move();

						if (p.isDead()) particles.splice(i, 1);
					}
				} else {
					s -= 2; //붓의 작아지는 양 원래 2
					initParticles();
				}
			}
			if (timer > 2600) {
				me = 0;
				indexImg = (indexImg + 1) % img.length;
				// background("#FFEDDA");
				n = 500; //붓의 양 1000
				s = 50;  //붓 굵기 20
				timer = 0;
			}
		}
		timer++;
	}
}

function initParticles() {
	if (timer > 50) {
		for (let i = 0; i < n; i++) {
			particles.push(new Particle(maxR, s));

			var p = particles[i];
			if (me === 0) {
				var x = int(map(p.pos.x, -maxR, maxR, 0, img[indexImg].width));
				var y = int(map(p.pos.y, -maxR, maxR, 0, img[indexImg].height));
				p.c = img[indexImg].get(x, y);
			}
			if (me === 1) {
				var x = int(map(p.pos.x, -maxR, maxR, 0, photo.width));
				var y = int(map(p.pos.y, -maxR, maxR, 0, photo.height));
				p.c = photo.get(x, y);
			}
		}
	}
}

function mouseClicked() {
	me = 0;
	timer = 0;
	indexImg = (indexImg + 1) % img.length;
	// background("#FFEDDA");
	n = 500; //붓의 양 1000
	s = 50;  //붓 굵기 20
}

function doubleClicked() {
	let fs = fullscreen();
	fullscreen(!fs);
}

class Particle {

	constructor(maxR_, s_) {
		this.s = s_;
		this.c = "";
		this.maxR = maxR_;

		this.life = 100;  //원래 100

		this.init();
	}

	init() {
		this.pos = p5.Vector.random2D();
		this.pos.normalize();
		this.pos.mult(random(2, maxR));

		this.vel = createVector();
	}

	show() {
		fill(this.c);
		ellipse(this.pos.x, this.pos.y, this.s, this.s);
		this.life -= 1;
	}

	move() {
		var angle = noise(this.pos.x / 400, this.pos.y / 400) * TAU; //원래 400 400

		this.vel.set(cos(angle), sin(angle));
		this.vel.mult(0.10); //원래 0.4
		this.pos.add(this.vel);
	}


	isDead() {
		var d = dist(this.pos.x, this.pos.y, 0, 0);

		if (d > this.maxR || this.life < 1) return true;
		else return false;
	}
}