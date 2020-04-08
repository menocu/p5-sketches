const url = 'https://quickdrawfiles.appspot.com/drawing/cat?isAnimated=false&format=json&key='

let strokeIndex = 0;
let index = 0;
let cat;
let prevx, prevy;
let keyInput;
let start;
var num_cats = 0;
var target = 360;
var cats = [];

function setup() {
  createCanvas(1000, 1250, SVG);
  //background(20);
  newCat();
  // keyInput = createInput('');
  // keyInput.attribute('type', 'password');
  // start = createButton('start');
  // start.mousePressed(newCat);
}

function newCat(x,y,rw,rh) {
  let apiKey = 'AIzaSyCLxdiMV5-46xuFWFbdDhVoJi7DMwe-H9Q'; // keyInput.value();
  loadJSON(url + apiKey, cat_no_draw);
}

function cat_no_draw(data){
  cats = cats.concat(data);
  num_cats++;
  if(num_cats < target){setTimeout( newCat, 1000);}
}

function gotCat(data) {
  cat = data.drawing;
  
  while(1){
    let x = cat[strokeIndex][0][index];
    let y = cat[strokeIndex][1][index];
    stroke(0);
    strokeWeight(3);
    if (prevx !== undefined) {
      line(prevx, prevy, x, y);
    }
    index++;
    if (index === cat[strokeIndex][0].length) {
      strokeIndex++;
      prevx = undefined;
      prevy = undefined;
      index = 0;
      if (strokeIndex === cat.length) {
        cat = undefined;
        strokeIndex = 0;
        
        break;
      }
    } else {
      prevx = x;
      prevy = y;
    }
  }
  cats = cats.concat(data);
}

function draw() {
  if (cats.length == target){
    draw_cats();
    save("mySVG.svg"); // give file name
    print("saved svg");
    noLoop();
  }
  else{
    setTimeout(function(){print(cats.length)}, 1000);
  }
}

function draw_cats(){
  print(cats.length);
  background(220);
  var accumw = 0;
  var accumh = 0;
  var num = 17
  var indexx = 0;
  var increment = width/(num+1);
  for(var i=0; i<100; i++){
    
    for(var j=0; j<num; j++){
      
      push();
      translate(accumw, accumh);
      scale(increment / 255);
      //rect(0, 0, 255, 255);
      gotCat(cats[indexx]);
      pop();
      
      accumw += increment;
      indexx++;
      if (indexx == 360){break;}
    }
    if (indexx === 360){break;}
    accumh += increment;
    accumw = 0;
    print(indexx);
  }
}