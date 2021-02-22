
class Triangle{

  constructor(size, x0, y0){
    this.size = size;
    this.x0 = x0;
    this.y0 = y0;
    }

  height(){
    return (this.size * (Math.sqrt(3)/2));
  }

  draw(context){

    context.moveTo(this.x0, this.y0);
    context.lineTo(this.x0 + (this.size / 2), this.y0 + this.height());
    context.lineTo(this.x0 - this.size/2, this.y0 + this.height());
    context.lineTo(this.x0, this.y0);



  }

}

function triangleHeight(size){
  return (size * (Math.sqrt(3)/2));
}

function updateRangeValue(value){

  const rangeText = document.getElementById("rangeVal");
  rangeText.textContent = value;

}

function sierpinski(depth, context, canvas, mainTriangle){
  if(depth == 0){
    mainTriangle.draw(context);
  }


  else{
    let ta1 = new Triangle(mainTriangle.size/2, mainTriangle.x0, mainTriangle.y0);
    let ta2 = new Triangle(mainTriangle.size/2, mainTriangle.x0 - (mainTriangle.size/4),mainTriangle.y0 + triangleHeight(mainTriangle.size/2));
    let ta3 = new Triangle(mainTriangle.size/2, mainTriangle.x0 + (mainTriangle.size/4),mainTriangle.y0 + triangleHeight(mainTriangle.size/2));


    ta1.draw(context);
    ta2.draw(context);
    ta3.draw(context);


    sierpinski(depth - 1, context, canvas, ta1);
    sierpinski(depth - 1, context, canvas, ta2);
    sierpinski(depth - 1, context, canvas, ta3);

  }
}

function main(){
  const rangeBar = document.getElementById("bar");
  const depth = rangeBar.value;

  updateRangeValue(depth);

  console.log(depth);

  const context = document.getElementById("canvas").getContext("2d");
  const canvas = document.getElementById("canvas");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  const t1 = new Triangle(550, 300, 50);
  sierpinski(depth, context, canvas, t1);


  context.lineWidth = 2;
  context.stroke();
  context.closePath();

}
