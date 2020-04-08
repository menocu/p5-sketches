var numPoints = 190;
var numCircles = 20
var center;

function setup() {
  createCanvas(1300, 1300, SVG);
  stroke(1);
}

function draw() {
  center = new p5.Vector(width/2, height/2);
  
  var min_rad = 120;
  var rad_scale = 50;
  var rad_coef = 1.01
  var angle_scale = PI/16;
  var angle_coef = .80;
  var angle_accum = 0;
  var toggle = 1;
  
  var dist_offset_accum = 0
  var dist_offset_scale = 4
  var dist_offset_coef = .9
  var angle_offset_accum = 0;
  var angle_offset_scale = PI
  var angle_offset_coef = 1
  
  var cs = [];

  for(var i=0; i<numCircles; i++){
    angle_accum = angle_scale * toggle;
    
    var this_radius = min_rad + (i * rad_scale);
    
    let x0 = center.x + dist_offset_accum/2*sin(angle_offset_accum);
    let y0 = center.y + dist_offset_accum/2*cos(angle_offset_accum);
    
    a = new Thing(x0, y0, this_radius, numPoints, angle_accum);
    //a.debug_draw();
    
    // accumulate for next loop...
    
    dist_offset_accum += dist_offset_scale;
    angle_offset_accum += angle_offset_scale;
    dist_offset_scale *= dist_offset_coef;
    angle_offset_scale *= angle_offset_coef;
    
    cs = cs.concat(a);
    angle_scale *= angle_coef;
    rad_scale *= rad_coef;
    toggle *= -1;
    
  }

  for(var pindex=0; pindex<numPoints; pindex++){
    for(var cindex=0; cindex<numCircles-1; cindex++){
      x1 = cs[cindex].points[pindex].x;
      y1 = cs[cindex].points[pindex].y;
      x2 = cs[cindex+1].points[pindex].x;
      y2 = cs[cindex+1].points[pindex].y;
      
      line(x1, y1, x2, y2);
    }
  }
  save("connected_circles_out.svg");
  noLoop();
}

// Jitter class
class Thing {
  constructor(x, y, r, num_points, rotation) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.num_points = num_points;
    this.rot  = rotation;
    this.angle = TWO_PI/this.num_points;
    this.points = []
    for (var i=0; i<this.num_points; i++){
      let new_x = this.x+this.r/2*sin(this.angle*i+this.rot);
      let new_y = this.y+this.r/2*cos(this.angle*i+this.rot);
      let p = new p5.Vector(new_x, new_y);
      this.points = this.points.concat(p);
    }
  }

  debug_draw(){
    ellipse(this.x, this.y, this.r, this.r);
    for(var i=0; i<this.points.length; i++){
      this.dot(this.points[i].x, this.points[i].y);
    }
  }
  
  dot(x,y){
    ellipse(x,y,5,5);
  }
}