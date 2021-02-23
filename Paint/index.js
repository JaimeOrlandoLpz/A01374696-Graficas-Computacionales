let lineWidth = 1;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const bar = document.getElementById("bar");
const lineWidthText = document.querySelector("p");
const clearButton = document.getElementById("clear-button");

const buttonArr = [];

buttonArr.push(document.getElementById("red-button"));
buttonArr.push(document.getElementById("blue-button"));
buttonArr.push(document.getElementById("yellow-button"));
buttonArr.push(document.getElementById("pink-button"));
buttonArr.push(document.getElementById("white-button"));
buttonArr.push(document.getElementById("black-button"));


let pressingDown = false;

context.fillStyle = "#44fe44";
context.fillRect(0, 0, canvas.width, canvas.height);


function setStartPosition(event){
  context.beginPath();
  context.moveTo(event.clientX, event.clientY);
  pressingDown = true;

}

function stopPainting(){
  pressingDown = false;
  context.closePath();

}

function draw(event){

  if(pressingDown){
    context.lineWidth = lineWidth;
    context.lineTo(event.clientX, event.clientY);
    context.stroke();
  }
}

function changeWidth(){
  context.lineWidth = bar.value;
  lineWidthText.textContent = bar.value;
  lineWidth = bar.value;
  console.log(context.lineWidth);
}

function changeColor(event){
  context.strokeStyle = this.textContent;
}

function clearCanvas(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', setStartPosition);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);
bar.addEventListener('input', changeWidth);

buttonArr.forEach(function(button){
  button.addEventListener('click', changeColor);
});

clearButton.addEventListener('click', clearCanvas);
