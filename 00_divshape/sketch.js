let font;
let renderBuffer = [];
let shapes = [];
let s1 = [];
let s2 = [];

/*
function preload() {
  font = loadFont('./helvetica.ttf');
}
*/
function setup() {
  createCanvas(1200, 1600, SVG);
  //background(220);
  stroke(1);
  s1 = []
  s1.push(createVector(100+random(-20,20), 300+random(-20,20)));
  s1.push(createVector(300+random(-20,20), 300+random(-20,20)));
  s1.push(createVector(300+random(-20,20), 100+random(-20,20)));
  s1.push(createVector(100+random(-20,20), 100+random(-20,20)));

  shapes.push(s1)
  s2 = []
  s2.push(createVector(150+random(-20,20), 150+random(-20,20)));
  s2.push(createVector(250+random(-20,20), 150+random(-20,20)));
  s2.push(createVector(250+random(-20,20), 250+random(-20,20)));
  s2.push(createVector(150+random(-20,20), 250+random(-20,20)));
  
  shapes.push(s2)
  
}

function draw() {
  /*let points = font.getPath("Rune Madsen", 150, height/2, 100);
  d.p = points
  */
  let num_iterations = 6
  let min_iter = 0
  let max_iter = 5
  let intermediate = []

  for(let i=0; i<num_iterations; i++){
    for(let j=0; j<max_iter; j++){
      let last = shapes.length
      do {
      shapes = divideOnce(shapes);
      } while (last == shapes.length)
      intermediate.push(shapes)
    }
    for(let j=min_iter; j<max_iter; j++){
      renderBuffer.push(intermediate[j])
    }
    
    intermediate = [];
    shapes = [];
    s1 = []
    s1.push(createVector(100+random(-20,20), 300+random(-20,20)));
    s1.push(createVector(300+random(-20,20), 300+random(-20,20)));
    s1.push(createVector(300+random(-20,20), 100+random(-20,20)));
    s1.push(createVector(100+random(-20,20), 100+random(-20,20)));

    shapes.push(s1)
  
    let s2 = []
    s2.push(createVector(150+random(-20,20), 150+random(-20,20)));
    s2.push(createVector(250+random(-20,20), 150+random(-20,20)));
    s2.push(createVector(250+random(-20,20), 250+random(-20,20)));
    s2.push(createVector(150+random(-20,20), 250+random(-20,20)));
  
    shapes.push(s2)
    
  }
  
  
  print("Done.");
  noLoop();
}

function mouseClicked(){
  /*
  let last = shapes.length
  shapes = divideOnce(shapes);
  if (shapes.length != last){
    renderBuffer.push(shapes);
  }
  print(renderBuffer.length)
  */
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    
    let numx = 5
    let numy = 6
    let accum = 0
  
    translate(40, 40);
    let scalefactor = 0.5;
    let tdist = (1000/numy) * 1/(scalefactor);
    scale(scalefactor, scalefactor);
    for (let i=0; i<numy; i++){
      push();
      translate(0,i*tdist);
      for (let j=0; j<numx; j++){
        push();
        translate(j*tdist, 0)
        shapesDraw(renderBuffer[accum]);
        accum++
        pop();
      }
      pop();
    }
  
    save("asdf.svg")
  }
}

function divideOnce(shapes){
  
  let p0 = new p5.Vector();
  let p1 = new p5.Vector();
  
  if (random(1) > .5) {
    p0.x = random(400);
    p0.y = 0;
    p1.x = random(400);
    p1.y = height;
  } else { 
    p0.x = 0;
    p0.y = random(400);
    p1.x = height;
    p1.y = random(400);
  }
  
  //line(p0.x, p0.y, p1.x, p1.y);
  
  let workIdx = []
  let retShapes = []
  let workShapes = []
  
  // for each shape, if the line doesn't touch it, just add it
  // to ret shapres, and we'll deal with the rest later.
  shapes.forEach(function(item, index) {
      if (hits(item, p0, p1)){workIdx.push(index)}
  })
  
  shapes.forEach(function(item, index) {
      if (workIdx.includes(index)){
        workShapes.push(item);
      } else {
        retShapes.push(deepCopyShape(item));
      }
  })
  
  if (workIdx.length == 0){return shapes}
  
  // split the shapes that require it.
  workShapes = splitShapes(workShapes, p0, p1)
  
  // merge the shapes that require it.
  workShapes = mergeShapes(workShapes)
  
  // shift the shapes that require it.
  retShapes = retShapes.concat(workShapes);
  retShapes = shiftShapes(retShapes, 15, true, p0, p1);
  
  // All done?
  return retShapes
  
}

function shiftShapes(shapes, mag, push, p0, p1){
  shapes.forEach(function(item, index) {
    shiftShape(item, mag, push, p0, p1);
  })
  return shapes
}

function mergeShapes(shapes){
      
  // subshapeinfo[j] == the shape I belong to.
  subshapeinfo = new Map();
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (i != j) {
        if (isSubShape(shapes[i], shapes[j])) {
          subshapeinfo.set(j, i);
        }
      }
    }
  }
  let finalShapeArrays = []

  shapes.forEach(function(item, index) {
    let finalshape = item;

    // if this shape index is a key in the map,
    // don't do anything with it.
    if (subshapeinfo.has(index)) {} 
    else {
      subshapeinfo.forEach(function(value, key, map) {
        if (index == value) {
          finalshape = finalshape.concat(shapes[key])
        }
      })
        f = deepCopyShape(finalshape)
        finalShapeArrays.push(f)
    }
  // if this shape index appears as a value for any keys in the map,
  // concatinate those shapes onto this shape.
  })
  return finalShapeArrays;
}

function splitShapes(shapes, p0, p1){
  let retShapes = []
  shapes.forEach(function(item, index) {
    retShapes = retShapes.concat(splitShape(item, p0, p1))
  })
  return retShapes
}

function splitShape(shape, p0, p1){
  let newShapeArrays = [];
  let l = shape.length;
  let isect_indecies = [];
  let newPoints = [];

  // Find intersection points
  for (let i = 0; i < l; i++) {
    
    newPoints.push(shape[i]);
    begin_index = i;
    end_index = ((i + 1) % l);

    print("testing p" + begin_index + " - p" + end_index);

    let newp = lineLine(p0.x, p0.y, p1.x, p1.y,
      shape[begin_index].x, shape[begin_index].y,
      shape[end_index].x, shape[end_index].y)

    if (newp) {
      newPoints.push(newp);
      isect_indecies.push(i + 1 + isect_indecies.length);
    }
  }

  // If the line intersects with the shape, make resultant shapes. 
  // TODO, more complicated is this shape negative space of the other shape logic
  if (isect_indecies.length) {

    newShapeArrays[0] = [];

    let start = isect_indecies[0]
    for (let i = start; i < newPoints.length + start; ++i) {
      let index = i % newPoints.length
      let thisPoint = newPoints[index]

      // Add this point to the last shape
      newShapeArrays[newShapeArrays.length - 1].push(thisPoint)

      // If this point is an intersection, make a new array, and begin it with this point.
      if (isect_indecies.indexOf(index) != -1) {
        let a = []
        a.push(thisPoint);
        newShapeArrays.push(a);
      }
    }

    let fix = newShapeArrays.shift();
    newShapeArrays[newShapeArrays.length - 1].push(fix[0]);
  }
  return newShapeArrays
}
// return true if shape is intersected at least twice by the line
// define by p0 p1.
function hits(shape, p0, p1){
  let l = shape.length;
  let hits = 0
  
  for (let i = 0; i < l; i++) {

    begin_index = i;
    end_index = ((i + 1) % l);

    let newp = lineLine(p0.x, p0.y, p1.x, p1.y,
                        shape[begin_index].x, shape[begin_index].y,
                        shape[end_index].x, shape[end_index].y)

    if (newp) {
      hits++;
      print("!")
      if (hits >= 2)
        break
    }
  }
  
  return (hits >= 2)
}

// First version
// p1 -> p2 defines the splitting line
function splitone(shape, p0, p1) {
  var l = shape.length;
  var isect_indecies = [];
  var newPoints = [];

  // Find intersection points
  for (let i = 0; i < l; i++) {
    newPoints.push(shape[i]);
    begin_index = i;
    end_index = ((i + 1) % l);

    print("testing p" + begin_index + " - p" + end_index);

    let newp = lineLine(p0.x, p0.y, p1.x, p1.y,
      shape[begin_index].x, shape[begin_index].y,
      shape[end_index].x, shape[end_index].y)

    if (newp) {
      newPoints.push(newp);
      isect_indecies.push(i + 1 + isect_indecies.length);
    }
  }

  // If the line intersects with the shape, make resultant shapes. 
  // TODO, more complicated is this shape negative space of the other shape logic
  if (isect_indecies.length) {

    let newShapeArrays = [];
    newShapeArrays[0] = [];

    let start = isect_indecies[0]
    for (let i = start; i < newPoints.length + start; ++i) {
      let index = i % newPoints.length
      let thisPoint = newPoints[index]

      // Add this point to the last shape
      newShapeArrays[newShapeArrays.length - 1].push(thisPoint)

      // If this point is an intersection, make a new array, and begin it with this point.
      if (isect_indecies.indexOf(index) != -1) {
        let a = []
        a.push(thisPoint);
        newShapeArrays.push(a);
      }
    }

    let fix = newShapeArrays.shift();
    newShapeArrays[newShapeArrays.length - 1].push(fix[0]);

    // subshapeinfo[j] == the shape I belong to.
    subshapeinfo = new Map();
    for (let i = 0; i < newShapeArrays.length; i++) {
      for (let j = 0; j < newShapeArrays.length; j++) {
        if (i != j) {
          if (isSubShape(newShapeArrays[i], newShapeArrays[j])) {
            subshapeinfo.set(j, i);
          }
        }
      }
    }
    finalShapeArrays = []

    newShapeArrays.forEach(function(item, index) {
      let finalshape = item;

      // if this shape index is a key in the map,
      // don't do anything with it.
      if (subshapeinfo.has(index)) {} else {
        subshapeinfo.forEach(function(value, key, map) {
          if (index == value) {
            finalshape = finalshape.concat(newShapeArrays[key])
          }
        })
        f = deepCopyShape(finalshape)
        finalShapeArrays.push(f)
      }
      // if this shape index appears as a value for any keys in the map,
      // concatinate those shapes onto this shape.
    })

    //
    // Some debug code:

    finalShapeArrays.forEach(function(item, index) {
      print("SHAPE " + index + "!!!!!");
      shiftShape(item, 10, true);
      shapeArrayDraw(item);
    })

  }
}

// shape2 is a subshape of shape1 if:
// 1. The first and last points of shape2 fall on the finite line
//    between the first and last points of shape1.
// 2. All other points of both shapes fall on the same side
//    of the infine line defined by the first and last points of
//    shape1

function isSubShape(sarray1, sarray2) {
  let cond1 = false;
  let cond2 = false;

  let lasts1 = sarray1.length - 1;
  let lasts2 = sarray2.length - 1;

  cond1 = linePoint(sarray1[0], sarray1[lasts1], sarray2[0]) &&
          linePoint(sarray1[0], sarray1[lasts1], sarray2[lasts2]);

  if (cond1) {
    print("!!!! LATEST !!!!");
    let c2results = []
    for (let i = 1; i < lasts1; i++) {
      print(sarray1[i].toString());
      c2results.push(which_side_pp(sarray1[0], sarray1[lasts1], sarray1[i]));
    }

    for (let i = 1; i < lasts2; i++) {
      print(sarray2[i].toString());
      c2results.push(which_side_pp(sarray1[0], sarray1[lasts1], sarray2[i]));
    }

    let unique = [...new Set(c2results)];
    print(unique);
    cond2 = (unique.length == 1)
  }

  return cond1 && cond2;
}


/**
 * Determines whether a point [px, py] is 'inside', 'outside' or on an 
 * infinite line that passes through the points [x0,y0] and [x1,y1].
 * The direction of a normal drawn from a point is considered 'outside'
 *
 * Returns either PLANE_INSIDE, PLANE_OUTSIDE or ON_PLANE
 */

//which_side_pp(float x0, float y0, float x1, float y1, float px, float py){
function which_side_pp(v0, v1, p0) {
  var ACCY = 1E-9;
  let dot = (v0.y - v1.y) * (p0.x - v0.x) + (v1.x - v0.x) * (p0.y - v0.y);
  if (dot < -ACCY)
    return -1
  else if (dot > ACCY)
    return 1
  else
    return 0
}

function linePoint(v0, v1, p0) {
  
  let d1 = dist(p0.x, p0.y, v0.x, v0.y);
  let d2 = dist(p0.x, p0.y, v1.x, v1.y);

  let lineLen = dist(v0.x, v0.y, v1.x, v1.y);
  print(lineLen + " : " + d1 + " : " + d2);
  
  if (d1 + d2 <= lineLen + .05) {
    print("Founds a subline.");
    return true;
  }
  return false;
}

function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the distance to intersection point
  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    var intersectionX = x1 + (uA * (x2 - x1));
    var intersectionY = y1 + (uA * (y2 - y1));
    return new p5.Vector(intersectionX, intersectionY);
  }
  return false;
}

function shapesDraw(shapes){
  shapes.forEach(function(item, index) {
    shapeArrayDraw(item)
  })
}

function shapeArrayDraw(d) {
  beginShape();
  d.forEach(function(item, index) {
    //fill(random(255), random(255), random(255), random(255));
    fill(0,0,0,0)
    vertex(item.x, item.y);
    //print("DRAWIGN:" + item.toString());
  })
  endShape(CLOSE);
}

// Shift all the points in s by the vector v
// 
function shiftShape(s, mag, push, p0, p1) {
  let angle = random(0, TWO_PI)
  f = new p5.Vector(p1.x - p0.x, p1.y - p0.y);
  f.setMag(mag);

  if (push) {
    f.rotate(PI / 2)
  }
  if(which_side_pp(s[1], p0, p1) == -1){
    f.rotate(3*PI/4)
  }
  //f.rotate(angle);
  s.forEach(function(item, index) {
    //print("Translating: " + item.toString());
    item.add(f)
    //print("Translated: " + item.toString());

  })
}

function deepCopyShape(s) {
  let retme = []
  s.forEach(function(item, index) {
    x = new p5.Vector(item.x, item.y)
    retme.push(x)
  })
  return retme
}