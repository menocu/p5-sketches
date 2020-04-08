function setup() {
  createCanvas(1000, 800, SVG);
  strokeWeight(1); 
  stroke(0, 0, 0); 
  background(255,255,255);
  noFill();
}

function draw() {

  depth = 12;
  b = new Box(0, 0, width, height, 0);
  var boxes = [b]

  for (var i = 0; i < depth; i++) {
    var oldlen = 0;
    var newlen = 0;

    //const array = ["one", "two", "three"]
    new_box_array = []
    boxes.forEach(function(item, index) {
      print("asdf");
      new_box_array = new_box_array.concat(subDivide(item));
      // They're the same array, we're done.
      oldlen = boxes.length;
      newlen = new_box_array.length;

      boxes = new_box_array;

    });

    // They're the same array.
    if (newlen == oldlen) {
      break;
    }
  }

  boxes.forEach(function(item, index) {
    item.draw_rand();
  });

  save("mySVG.svg"); // give file name
  print("saved svg");
  noLoop();
}

// A rectangle subdivider - take this rectangle and divide it into two
// rects, and return those.
// TODO: enforce minimum size?
// If it's above a maximum size and it's not an arlie box,
// continue subbing.
function subDivide(box) {
  if (box.area < 500 || box.is_done) {
    return [box];
  }

  divx = random(box.wide / box.tall) > 1.6 ? true : false;
  var prob = 0.8;
  
  if (divx) {
    nw = (0.5 * box.wide) + (randomGaussian() / 4) * (box.wide / 2);
    b1 = new Box(box.x, box.y, nw, box.tall, box.depth + 1);
    b2 = new Box(box.x + nw, box.y, box.wide - nw, box.tall, box.depth + 1);

    if (b1.depth > 3 && random(1) > prob) {b1.is_done = true}
    if (b2.depth > 3 && random(1) > prob) {b2.is_done = true}

    return [b1, b2];
  }

  nh = (0.5 * box.tall) + (randomGaussian() / 6) * (box.tall / 2);
  b1 = new Box(box.x, box.y, box.wide, nh, box.depth + 1);
  b2 = new Box(box.x, box.y + nh, box.wide, box.tall - nh, box.depth + 1);
  
  if (b1.depth > 3 && random(1) > prob) {b1.is_done = true}
  if (b2.depth > 3 && random(1) > prob) {b2.is_done = true}
  
  return [b1, b2];
}

function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {

  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below

  var left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  var right = lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  var top = lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  var bottom = lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    var ret = [];
    if (left) ret = ret.concat(left);
    if (right) ret = ret.concat(right);
    if (top) ret = ret.concat(top);
    if (bottom) ret = ret.concat(bottom);
    
    return ret
  }
  return false;
}


function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the distance to intersection point
  //print((y1-y3));
  //print(x1, y1, x2, y2, x3, y3, x4, y4);
  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    var intersectionX = x1 + (uA * (x2 - x1));
    var intersectionY = y1 + (uA * (y2 - y1));
    return [intersectionX, intersectionY];
  }
  return false;
}

// Jitter class
class Box {
  constructor(x, y, wide, tall, depth) {
    this.x = x;
    this.y = y;
    this.tall = tall;
    this.wide = wide;
    this.area = this.wide * this.tall;
    this.depth = depth;
    this.is_done = false;
  }

  draw_rand() {

    var num_algos = 5;
    var small = 3000;
    var vsmall = 2000;
    
    var this_fill;
    if(this.area <= vsmall)
      this_fill = parseInt(random(4))
    else if(this.area <= small)
      this_fill = parseInt(random(4))
    else 
      this_fill = parseInt(random(4,6))
    
    print(this_fill);
    switch (this_fill) {
      case 0:
        this.fill_dot();
        break;
      case 1:
        //
        break;
      case 2:
        this.fill_cross();
        break;
      case 3:
        this.fill_dark();
        break;
      case 4:
        this.fill_dotgrad();
        break;
      case 5:
        this.fill_hatch(6, 12);
        break

    }
    
    if (random(1) < 0.9)
      rect(this.x, this.y, this.wide, this.tall);
  }

  fill_cross() {
    line(this.x, this.y, this.x + this.wide, this.y + this.tall);
    line(this.x, this.y + this.tall, this.x + this.wide, this.y);
  }

  fill_dot() {
    var dx = this.x + (this.wide / 2);
    var dy = this.y + (this.tall / 2);
    ellipse(dx, dy, 2);
    ellipse(dx, dy, 4);
  }

  fill_dotgrad() {
    // Directions are 0-4, N E S W. 
    var dir = parseInt(random(2));
    var area = this.wide * this.tall;
    //print(area);
    //var num_dots = parseInt(area/100);
    //print(num_dots);

    var steps = 10;
    var increment = this.wide / steps;
    var accum = 0;
    for (var i = 0; i < steps; i++) {

      var coef = .1;
      var fade = .06;
      var points = (increment * this.tall) * coef * (fade * (steps - i - 3));
      //print(points);
      for (var j = 0; j < points; j++) {
        var px = random(this.x + accum, this.x + accum + increment);
        var py = random(this.y, this.y + this.tall);
        point(px, py);
      }
      accum += increment;
    }
  }

  fill_hatch(spacemin, spacemax) {
    var space = random(spacemin, spacemax);
    var angle = random(-PI / 8, PI / 8) + 1.5 * PI;
    var maxlen = sqrt(height * height + width * width);

    // draw lines to the right...
    // lineRect(x1, y1, x2, y2, rx, ry, rw, rh)
    for (var i = -width; i < width*2; i += space) {
      var x1 = i;
      var y1 = 0;
      var x2 = i + cos(angle) * maxlen;
      var y2 = y1 - sin(angle) * maxlen;

      //print(x1,y1,x2,y2);
      var ret = lineRect(x1, y1, x2, y2,
        this.x, this.y, this.wide, this.tall)
      if (ret) {
        //print(ret[1]);
        line(ret[0], ret[1], ret[2], ret[3]);
      }
    }
  }

  fill_dark() {
    this.fill_hatch(2, 3);
  }

  contract() {
    var f = 2
    this.x += f;
    this.y += f;
    this.tall -= 2 * f;
    this.wide -= 2 * f;
  }

  lineAngle(x, y, angle, length) {
    line(x, y, x + cos(angle) * length, y - sin(angle) * length);
  }

}