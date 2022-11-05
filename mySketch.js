var particles;
var img = []
var n, s, maxR;
var indexImg = 0;
var timer = 0;
let me=0;

let faceapi;
let video;
let detections;
let photo;

const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}
function preload(){
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
	video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady);
}
function setup() {
	 createCanvas(windowWidth, windowHeight);
	//createCanvas(1065, 1920);
	// video = createCapture(VIDEO);
    // video.size(width, height);
    // video.hide(); // Hide the video element, and just show the canvas
    // faceapi = ml5.faceApi(video, detection_options, modelReady);

    // counting = 0;

	background("#FFEDDA");
	smooth();
	
	n = 500; //붓의 양 1000
	s = 50;  //붓 굵기 20
	maxR = height/2 - height/10;
	
	particles = [];
	if(me === 0){
	// img.push(loadImage('KakaoTalk_20221025_034445073.png'));
	// img.push(loadImage('face1.png'));
	// img.push(loadImage('face2.png'));
	// img.push(loadImage('face3.png'));
	// img.push(loadImage('face4.png'));
	// img.push(loadImage('face5.png'));
	// img.push(loadImage('face6.png'));
	// img.push(loadImage('face7.png'));
	// img.push(loadImage('face8.png'));
	// img.push(loadImage('face9.png'));
	// img.push(loadImage('face10.png'));
	// img.push(loadImage('face11.png'));
	// img.push(loadImage('face12.png'));
	}
	if(me === 1){	
			photo = video;	
	}
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    detections = result;

    if (detections) {
        if (detections.length > 0) {
			console.log("Start");
			if(timer < 10){
            me = 1;
			setup();
			}
        }

    }
    faceapi.detect(gotResults)
}

function draw() {
	console.log(timer, me);
	translate(width/2, height/2);
	noStroke();
	
	if(s > 1) {
		if(particles.length != 0) {
			for(let i = 0; i < particles.length; i++) {
				var p = particles[i];
				p.show();
				p.move();
				
				if(p.isDead()) particles.splice(i, 1);
			}
		} else {
			s -= 5; //붓의 작아지는 양 원래 2
			initParticles();
		}
	}
	if(timer > 1200){
		me = 0;
		indexImg = (indexImg + 1) % img.length;
	setup();
	timer = 0;
	// counting = 0;
	}
	timer++;
}

function initParticles() {	
	for(let i = 0; i < n; i++) {
		particles.push(new Particle(maxR, s));
		
		var p = particles[i];
		if(me === 0){
		var x = int(map(p.pos.x, -maxR, maxR, 0, img[indexImg].width));
    var y = int(map(p.pos.y, -maxR, maxR, 0, img[indexImg].height));
		p.c = img[indexImg].get(x, y);
		}
		if(me === 1){
			var x = int(map(p.pos.x, -maxR, maxR, 0, photo.width));
    var y = int(map(p.pos.y, -maxR, maxR, 0, photo.height));
		p.c = photo.get(x, y);
		}
	}
}

function mouseClicked() {
	me = 0;
	timer = 0;
	indexImg = (indexImg + 1) % img.length;
	setup();
}

function doubleClicked(){
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
    var angle = noise(this.pos.x / 200, this.pos.y / 200) * TAU; //원래 400 400
    
    this.vel.set(cos(angle), sin(angle));
    this.vel.mult(0.11); //원래 0.4
    this.pos.add(this.vel);
  }
  

  isDead() {
    var d = dist(this.pos.x, this.pos.y, 0, 0);
 
    if(d > this.maxR || this.life < 1) return true;
    else return false;
  }
}