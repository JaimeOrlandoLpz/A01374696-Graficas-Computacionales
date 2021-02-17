//jshint esversion:6



let keysDown ={
  'q': false,
  'a': false,
  'r': false,
  's': false
};

class Ball
{
    constructor(xPos, yPos, radius, color)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;

        this.up = false;
        this.right = true;

        this.speed = 0.1;
    }

    draw(context)
    {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    update(xMin, xMax, yMin, yMax, leftBar, rightBar)
    {

        const p1Header = document.getElementById("p1");
        const p2Header = document.getElementById("p2");

        const scoreBaseStr = "Score: "

        if(this.xPos <= (leftBar.x + leftBar.width+ 5) && this.yPos >= leftBar.y && this.yPos <= leftBar.y + (leftBar.height - 5)){
          this.right = true;
        }

        if(this.xPos >= rightBar.x - rightBar.width && this.yPos >= rightBar.y && this.yPos <= rightBar.y + (rightBar.height)){
          this.right = false;
        }

        if(this.xPos <= -5){
          rightBar.associatedScore++;
          p2Header.textContent = scoreBaseStr + rightBar.associatedScore;
          this.xPos = 150;
          this.yPos = 75;
        }

        if(this.xPos >= 305){
          leftBar.associatedScore++;
          p1Header.textContent = scoreBaseStr + leftBar.associatedScore;
          this.xPos = 150;
          this.yPos = 75;
        }

        if(this.yPos > (yMax - this.radius)) this.up = true;
        if(this.yPos < (yMin + this.radius)) this.up = false;

        if(this.right)
            this.xPos += this.speed;
        else
            this.xPos -= this.speed;

        if(this.up)
            this.yPos -= this.speed;
        else
            this.yPos += this.speed;
    }
}



class Bar{
  constructor(x, y, width, height, color, associatedScore){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.associatedScore = 0;
  }

  draw(context){
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp(){
    this.y -= 0.5;
  }

  moveDown(){
    this.y += 0.5;
  }

  update(keyDown){
    if(keyDown['q'] && this.x === 10 && this.y > 10){
      this.moveUp();
    }

    if(keyDown['p'] && this.x === 10 && this.y < 95){
      this.moveDown();
    }

    if(keyDown['r'] && this.x === 275 && this.y > 10){
      this.moveUp();
    }

    if(keyDown['s'] && this.x === 275 && this.y < 95){
      this.moveDown();
    }
  }

}


function drawRectangles(context, leftRect, rightRect){
  context.fillStyle = leftRect.color;
  context.fillRect(leftRect.x, leftRect.y, leftRect.width, leftRect.height);
  context.fillStyle = rightRect.color;
  context.fillRect(rightRect.x, rightRect.y, rightRect.width, rightRect.height);
}

function update(context, canvas, leftBar, rightBar, ball){
  requestAnimationFrame(function(){
    update(context, canvas, leftBar, rightBar, ball);
  });

  context.clearRect(0,0, canvas.width, canvas.height);
  drawRectangles(context, leftBar, rightBar);
  ball.draw(context);
  ball.update(0, 300, 0, 150, leftBar, rightBar);
  //context.fillRect();
  leftBar.update(keysDown);
  rightBar.update(keysDown);
}

function main(){

  // Obtener el Contexto para poder dibujar
  const canvas = document.getElementById("pongCanvas");
  const context = canvas.getContext("2d");


  const leftBar = new Bar(10, 10, 15, 45, 'blue', 0);
  const rightBar = new Bar(275, 10, 15, 45, 'pink', 0)
  const ball = new Ball(150, 75, 7.5, 'white');

  document.addEventListener("keydown", function(){
    console.log(event.key);
    if(event.key === 'p'){
      keysDown['p'] = true;
    }

    else if (event.key === 'q') {
      keysDown['q'] = true;
    }

    else if(event.key === 'r'){
      keysDown['r'] = true;
    }

    else if(event.key === 's'){
      keysDown['s'] = true;
    }

    update(context, canvas, leftBar, rightBar, ball);

  });

  document.addEventListener("keyup", function(){
    if(event.key === 'p'){
      keysDown['p'] = false;
    }

    else if (event.key === 'q') {
      keysDown['q'] = false;
    }

    else if (event.key === 'r') {
      keysDown['r'] = false;
    }

    else if (event.key === 's') {
      keysDown['s'] = false;
    }

    update(context, canvas, leftBar, rightBar, ball);
  });

  update(context, canvas, leftBar, rightBar, ball);

}
