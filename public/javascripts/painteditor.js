//Setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//initialize default choices for dropdowns
var colorChoice="Green";
var shapeChoice="Rectangle";

//Color conversion to HEX
var colors = {"Blue":"#1976D2","Purple":"#673AB7","Green":"#009688","Red":"#D32F2F","Orange":"#FF5722","Black":"#000000","White":"#ffffff"}

//Keeps track of input in text box
var text_value = "";

//Keeps track of arrow keys that are down
var vertical_key = null;
var horizontal_key = null;

//Check for arrow keys:
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
    	vertical_key = "up";
    }
    else if (e.keyCode == '40') {
        // down arrow
        vertical_key = "down";
    }
    else if (e.keyCode == '37') {
       // left arrow
       horizontal_key = "left";
    }
    else if (e.keyCode == '39') {
       // right arrow
       horizontal_key = "right";
    }
}
document.onkeyup = releaseKeys;
function releaseKeys(e){
    e = e || window.event;
    if(e.keyCode == '38' || e.keyCode == '40'){
    	vertical_key = null;
    }
    if(e.keyCode == '37' || e.keyCode == '39'){
		horizontal_key = null;
    }
}

//Vector Math Helper Functions
function dot(a,b){
  if (a.length != b.length){
    throw "dot of different length vectors";	
  }
  result = 0;
  for(i=0;i<a.length;i++){
    result += a[i]*b[i];	
  }
  return result;
}
function subtract_vec(v1,v2){
  if (v1.length != v2.length){
    throw "subtract_vec of different length vectors";
  }
  result = [];
  for(i=0;i<v1.length;i++){
    result.push(v1[i]-v2[i]);  	
  }
  return result;
}
function magnitude(v1){
	result = 0;
	for(i=0;i<v1.length;i++){
		result+=v1[i]*v1[i];
	}
	return Math.sqrt(result);
}

//UPDATED FOR MDL Material Design Dropdown
function getChoice(topic){
  console.log("topic",topic);
  if(topic == "Colors"){
    return colorChoice;
  }
  else if(topic == "Shapes"){
    return shapeChoice;
  }
	//Original (Pre MDL) Code:
  // return document.getElementById(topic)[document.getElementById(topic).selectedIndex].value;
}
//Created for MDL Material Design Dropdown
function updateChoice(topic,choice){
  if(topic == "Colors"){
    colorChoice = choice;
  }  
  else if(topic == "Shapes"){
    shapeChoice = choice;
  }
}


//MAIN: Create instance of Easel()
var myEasel = new Easel();
//Initialize current_tool
var current_tool = "cursor";

//Create Event Listeners
canvas.addEventListener("mousedown",myEasel.mouseDown.bind(myEasel));
canvas.addEventListener("mouseup",myEasel.mouseUp.bind(myEasel));
canvas.addEventListener("mousemove",myEasel.mouseMove.bind(myEasel));
canvas.addEventListener("dblclick",myEasel.doubleClick.bind(myEasel));
document.addEventListener("keydown",myEasel.keyDownOrPress.bind(myEasel));

//Canvas Offsets from top left of body, used for mouse tracking adjustment
left_offset = $('canvas').offset().left;
top_offset = $('canvas').offset().top; 

//mouse coords at any time
var mouse=[0,0];
//Tracks shift key ONLY when mouse is moving
var shiftDown = false;
//Keeps track of these mouse (mouse position) and shiftDown (if shift key is down) with a listener when the mouse moves
document.addEventListener('mousemove', function(e) { 
  mouse = [e.pageX - left_offset, e.pageY - top_offset];
  shiftDown = false;
  if(event.shiftKey){
    shiftDown = true;
  }
});

//stores canvas dimensions
var canvas_dimensions = [+$('canvas').attr("width"),+$('canvas').attr("height")];
console.log("canvas_dimensions",canvas_dimensions);

//keeps track of whether an active text input box exists
var text_box_exists = false;


//Attaches buttons to their tool activating functions
$('#imageTool').click(function(){
	myEasel.imageTool();
});

$('#textTool').click(function(){
	myEasel.textTool();
});

$('#cursorTool').click(function(){
	myEasel.cursorTool();
});
$('#shapeDrawFillTool').click(function(){
	myEasel.shapeDrawFillTool();	
});
$('#shapeDrawOutlineTool').click(function(){
  myEasel.shapeDrawOutlineTool();  
});
$('#drawTool').click(function(){
	myEasel.drawTool();	
});