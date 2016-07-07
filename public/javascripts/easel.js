/* TODOs:
- Multiple select: keep a list of selected shapes and wherever this.selected_shape is used, loop through the list
- Images: have only been started to be implemented
- Text: improve
- Rotate: some math has been done, but still not implemented
- Resize: not implemented
- Drag shapes (especially outline) by middle_circle in addition to current way
*/

function Easel(){
	//Configure EaselJS
	console.log("EaselJS at YO SERVICE BROTHA");
	this.stage = new createjs.Stage("myCanvas");
 
 	//List maintaining all shapes on stage
 	this.shapes = [];
 	//While drawing a shape, current_shape is the latest version of the shape, anything before that is deleted/forgotten 
 	this.current_shape = null;
 	//A variable that keeps track of whether the mouse is down, useful for logic
 	this.mouseIsDown = false;

 	//Potentially useful lines of code:
	// this.stage.mouseMoveOutside = true;
 	//createjs.Touch.enable(this.stage);
}

Easel.prototype.lineDraw = function(s,t,shape, color){
		shape.graphics.setStrokeStyle(1).beginStroke(color).moveTo(s[0], s[1]).lineTo(t[0], t[1]).endStroke();		
		this.stage.addChild(shape);
		this.stage.update();
		return shape;		
}
//Draws a shape according to shape.shape_name. Options are: Square, Rectangle, Circle, Oval, Line, StrictLine
Easel.prototype.shapeDraw = function(start,shape) {

		//Gets shape choice and modifies according to whether ShiftKey is down.
		shape.shape_name = getChoice("Shapes");
			if(shiftDown && shape.shape_name=="Rectangle"){
				shape.shape_name = "Square";
			}
			else if(!shiftDown && shape.shape_name=="Square"){
				shape.shape_name = "Rectangle";
			}
			
			if(shiftDown && shape.shape_name == "Oval"){
				shape.shape_name = "Circle";
			}
			else if(!shiftDown && shape.shape_name == "Circle"){
				shape.shape_name = "Oval";
			}

			if(shiftDown && shape.shape_name == "Line"){
				shape.shape_name = "StrictLine";
			}
			else if(!shiftDown && shape.shape_name == "StrictLine"){
				shape.shape_name = "Line";
			}

		//clear last update of shape
		shape.graphics.clear();


		//Allow drawing to continue when mouse is off canvas *May be not completely working yet*
		adj_mouse = mouse;
		if (mouse[0]>canvas_dimensions[0]){
			adj_mouse[0] = canvas_dimensions[0]-1;
		}
		if (mouse[1]>canvas_dimensions[1]){
			adj_mouse[1] = canvas_dimensions[1]-1;
		}

		//mouse x and y distances from start point
    	shape.diffx = adj_mouse[0]-start[0];
    	shape.diffy = adj_mouse[1]-start[1];
    	console.log("diffx,diffy",shape.diffx,shape.diffy);
    	//DRAW ALL SHAPES
			//Draw Line
			if(shape.shape_name == "Line"){
				this.lineDraw(start,adj_mouse,shape,getChoice("Colors"));
			}
			//Draw Straight Line that snaps to 90degs
			if(shape.shape_name == "StrictLine"){
				//Draw line at 90 degrees
				if(Math.abs(shape.diffy)>Math.abs(shape.diffx)){
					this.lineDraw(start,[start[0],adj_mouse[1]],shape,getChoice("Colors"));
				}
				else if(Math.abs(shape.diffy)<Math.abs(shape.diffx)){
					this.lineDraw(start,[adj_mouse[0],start[1]],shape,getChoice("Colors"));
				}
				//Diagonal?
				shape.graphics.endStroke();
			}
	    	//Draw Oval
	    	if(shape.shape_name == "Oval"){
				if (current_tool == "shapeDrawFill"){
					shape.graphics.beginFill(getChoice("Colors"));
				}
				else if(current_tool == "shapeDrawOutline"){
					shape.graphics.beginStroke("#000");
				}
				shape.graphics.drawEllipse(0,0,shape.diffx,shape.diffy);
				shape.xradius = Math.abs(shape.diffx)/2.0;
				shape.yradius = Math.abs(shape.diffy)/2.0;

				shape.x = start[0];
				shape.y = start[1];

				shape.midpoint = [shape.x+shape.xradius,shape.y+shape.yradius]
				shape.setBounds(shape.x-shape.diffx,shape.y-shape.diffy,shape.x+shape.diffx,shape.y+shape.diffy);

	    	}
	    	//Draw Circle:
	    	if(shape.shape_name == "Circle"){
		    	shape.radius = Math.max(Math.abs(shape.diffx),Math.abs(shape.diffy))/2.0;			
				if (current_tool == "shapeDrawFill"){
					shape.graphics.beginFill(getChoice("Colors"));
				}
				else if(current_tool == "shapeDrawOutline"){
					shape.graphics.beginStroke("#000");
				}
				shape.graphics.drawCircle(0, 0, shape.radius);

				//Allows drawing shapes in all directions
				shape.x = start[0]+shape.radius;
				shape.y = start[1]+shape.radius;

				shape.midpoint = [shape.x,shape.y]		

				if(shape.diffx<0){
					shape.x = shape.x-2*shape.radius; 
				}
				if(shape.diffy<0){
					shape.y = shape.y-2*shape.radius;
				}
				shape.setBounds(shape.x-shape.radius,shape.y-shape.radius,shape.x+shape.radius,shape.y+shape.radius);

			}  
	    	//Draw Rectangle
	    	else if(shape.shape_name == "Rectangle"){
				if (current_tool == "shapeDrawFill"){
					shape.graphics.beginFill(getChoice("Colors"));
				}
				else if(current_tool == "shapeDrawOutline"){
					shape.graphics.beginStroke("#000");
				}
				shape.graphics.drawRect(0,0,shape.diffx,shape.diffy);
				shape.x = start[0];
				shape.y = start[1];

				shape.midpoint = [shape.x + shape.diffx/2, shape.y + shape.diffy/2]
	    		shape.setBounds(shape.x,shape.y,shape.diffx,shape.diffy);

	    	}
	    	//Draw Square
	    	else if(shape.shape_name == "Square"){
	    		if (Math.abs(shape.diffx)>=Math.abs(shape.diffy)){
	   				shape.sidex = Math.abs(shape.diffx);
	   				shape.sidey = Math.abs(shape.diffx);
	    		}
	    		else{
	    			shape.sidex = Math.abs(shape.diffy);
	    			shape.sidey = Math.abs(shape.diffy);
	    		}
	    		if (shape.diffx < 0){
	    			shape.sidex = -shape.sidex;
	    		}
	    		if (shape.diffy < 0){
	    			shape.sidey = -shape.sidey;
	    		}
				if (current_tool == "shapeDrawFill"){
					shape.graphics.beginFill(getChoice("Colors"));
				}
				else if(current_tool == "shapeDrawOutline"){
					shape.graphics.beginStroke("#000").beginFill;
				}
	    		shape.graphics.drawRect(0,0,shape.sidex,shape.sidey);
	    		shape.x = start[0];
	    		shape.y = start[1];
	    		shape.setBounds(shape.x,shape.y,shape.sidex,shape.sidey);
	    	}
	    //Initialize selection_lines	
	   	shape.selection_lines = [];
	    //update current shape
    	this.current_shape = shape;
    	//add only the current shape to the stage
		this.stage.addChild(this.current_shape);
		//Render graphics
		this.stage.update();
}

Easel.prototype.rotate = function(start){
	//Calculate delta-angle of mouse from midpoint, from dot product of vectors: (center->start) DOT (center->mouse)
	v1 = subtract_vec(start,this.selected_shape.midpoint);
	v2 = subtract_vec(mouse,this.selected_shape.midpoint);
	angle = dot(v1,v2)/(magnitude(v1)*magnitude(v2));
	
	//HOW TO ROTATE:
	//this.selected_shape.rotation++;

	//Render graphics
	this.stage.update;

}

Easel.prototype.resize = function(){

}

Easel.prototype.dragOn = function(){
	   	if(mouse != this.start){
	   		//Define amount to move
	   		console.log(mouse);
	   		x_change = mouse[0] - this.start[0];
	   		y_change = mouse[1] - this.start[1];
	   		//Move to next location
		   	this.selected_shape.x = this.selected_shape_start[0] + x_change;
		    this.selected_shape.y = this.selected_shape_start[1] + y_change;

		    //(deselect) and select selected shape repeatedly at every move so that selection lines and circles are in place throughout drag
		    if(this.mouseIsDown){
		    	this.select();
		    }
		    //Render Graphics
		    this.stage.update();
		}
}

Easel.prototype.budge = function(vertical,horizontal){
	//Calculate change
	x_change = 0;
	y_change = 0;
	if(vertical == "up"){
		y_change = -2;
	}
	else if (vertical == "down"){
		y_change = 2;
	}
	if(horizontal == "right"){
		x_change = 2;
	}
	else if(horizontal == "left"){
		x_change = -2;
	}
	//Move to next location
	this.selected_shape.x += x_change;
	this.selected_shape.y += y_change;
	
	//Keep selected
	this.select();
	//Render Graphics
	this.stage.update();	
}

Easel.prototype.select = function(){
	//clear last update of shape
	this.deselect();
	//Get the bounds of the shape which is a property that has: x, y, and width and height, note that we set these manually earlier in shapeDraw() with setBounds()
	this.selected_shape.bounds = this.selected_shape.getBounds();
	if(this.selected_shape.shape_name == "Rectangle" || this.selected_shape.shape_name == "Square" || this.selected_shape.shape_name == "Image" ){
		left_x = this.selected_shape.x;
		right_x = this.selected_shape.x + this.selected_shape.bounds.width;
		top_y = this.selected_shape.y;
		bottom_y = this.selected_shape.y + this.selected_shape.bounds.height;
		this.selected_shape.midpoint = [this.selected_shape.x + this.selected_shape.diffx/2, this.selected_shape.y + this.selected_shape.diffy/2];
		if (this.selected_shape.shape_name == "Square"){
			this.selected_shape.midpoint = [this.selected_shape.x + this.selected_shape.sidex/2, this.selected_shape.y + this.selected_shape.sidey/2];
		}
	}
	else if(this.selected_shape.shape_name == "Circle"){
		left_x = this.selected_shape.x-this.selected_shape.radius;
		right_x = this.selected_shape.x + this.selected_shape.radius;
		top_y = this.selected_shape.y-this.selected_shape.radius;
		bottom_y = this.selected_shape.y + this.selected_shape.radius;
		this.selected_shape.midpoint = [this.selected_shape.x,this.selected_shape.y];

	}
	else if(this.selected_shape.shape_name == "Oval"){
		left_x = this.selected_shape.x;
		right_x = this.selected_shape.x + 2*this.selected_shape.diffx/2;
		top_y = this.selected_shape.y;
		bottom_y = this.selected_shape.y + 2*this.selected_shape.diffy/2;
		this.selected_shape.midpoint = [this.selected_shape.x+this.selected_shape.diffx/2,this.selected_shape.y+this.selected_shape.diffy/2];		
	}

	//Half pixel shifts that fix a bug that has to do with antialiasing and the differences in resolution between the screen and the canvas. This prevents the selection lines from showing up as transparent
	left_x -=.5;
	right_x +=.5;
	top_y -=.5;
	bottom_y +=.5;


	//corner_points stores the 4 corners
	corner_points = [[left_x,top_y],[right_x,top_y],[right_x,bottom_y],[left_x,bottom_y]];
	//side_points stores the 4 halfway points of the sides
	side_points = [[this.selected_shape.midpoint[0],top_y],[this.selected_shape.midpoint[0],bottom_y],[left_x,this.selected_shape.midpoint[1]],[right_x,this.selected_shape.midpoint[1]]];
	for (i = 0; i < 4; i++) {
		//DRAW LINES:
		line = this.lineDraw(corner_points[i%4],corner_points[(i+1)%4],this.shape,"#000000");
		this.selected_shape.selection_lines.push(line);
	}
	for(i=0; i <4; i++){
		//DRAW SIDE CIRCLES:
		side_circle = new createjs.Shape();
		side_circle.radius = 3.5;
		side_circle.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill("#ffffff").drawCircle(0, 0, side_circle.radius);

		//put in each corner
		side_circle.x = side_points[i][0];
		side_circle.y = side_points[i][1];
		this.selected_shape.side_circles.push(side_circle);
		this.stage.addChild(side_circle);

		//DRAW CORNER CIRCLES:
		corner_circle = new createjs.Shape();
		corner_circle.radius = 3.5;
		corner_circle.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill("#ffffff").drawCircle(0, 0, corner_circle.radius);

		//put in each corner
		corner_circle.x = corner_points[i][0];
		corner_circle.y = corner_points[i][1];
		this.selected_shape.corner_circles.push(corner_circle);
		this.stage.addChild(corner_circle);
	}
	//Render Graphics
	this.stage.update();
}

Easel.prototype.deselect = function(){
	//clear last update of shape
	if (this.selected_shape){
		for(i = 0; i < this.selected_shape.selection_lines.length; i++){
			// Clear: line, side_circle & corner_circle
			this.selected_shape.selection_lines[i].graphics.clear(); 
		 	this.selected_shape.side_circles[i].graphics.clear(); 
		 	this.selected_shape.corner_circles[i].graphics.clear(); 
		}

		//Render graphics
		this.stage.update();

		//empty lists storing the selection_lines corner_circles and side_circles
		this.selected_shape.selection_lines=[];
		this.selected_shape.corner_circles = [];
		this.selected_shape.side_circles = [];
	}
}

//Draws a line as the user clicks and moves the mouse
Easel.prototype.draw = function(start,shape) {
	this.lineDraw(start,mouse,shape,getChoice("Colors"));
}

//MOUSE CONTROLS:
Easel.prototype.mouseDown = function(){
    this.mouseIsDown = true;
	//this.start stores the original position of the mouse when the mouse was clicked down
	this.start = mouse;
	if(current_tool=="shapeDrawFill" || current_tool=="shapeDrawOutline"){
	    //Create a Shape object
	    this.shape = new createjs.Shape();
	}
	else if(current_tool == "draw"){
		//Create a Shape object
		this.shape = new createjs.Shape();
	}

	else if(current_tool == "text"){
		//If a text box already exists and is empty, delete it. Now: no text box exists
		if (text_box_exists && text_value == ""){
			document.body.removeChild(this.html);
			text_box_exists = false;
			
		}
		//If no text box exists: make one at mouse pos
		if (!text_box_exists){	
			this.html = document.createElement('input');
			this.html.type = 'text';
			this.html.id="textInput";
			this.html.value = "";
			this.html.style.position = "absolute";
			console.log(top_offset);
			this.html.style.top = (top_offset-9).toString()+"px";
			this.html.style.left = left_offset.toString()+"px";
			this.html.style.zIndex = 2;
			document.body.appendChild(this.html);
			this.textBox = new createjs.DOMElement(this.html);
			this.textBox.x = mouse[0];
			this.textBox.y = mouse[1];
			this.stage.addChild(this.textBox);
			text_box_exists = true;
			this.stage.update();
		}
		//Else: there is a text box and it is populated, so remove html element and display as image
		else{
			document.body.removeChild(this.html);
			text_box_exists = false;
			//Create image version of text
			this.text = new createjs.Text(text_value);
			this.text.cursor = "text";
			this.text.x = this.textBox.x;
			this.text.y = this.textBox.y-9;
			this.stage.addChild(this.text);				
			this.stage.update();
			text_value = "";
			
		}
	}

	else if(current_tool=="image"){
		//STILL NEEDS WORK: implementation only started
		this.image = new createjs.Bitmap("/Users/Rami/Desktop/Rami.jpg");
		this.image.x = mouse[0];
		this.image.y = mouse[1];
		this.image.selection_lines = [];
		this.image.shape_name = "Image";
	    this.image.setBounds(this.image.x,this.image.y,this.image.image.width,this.image.image.height);
		this.selected_shape = this.image;
		this.stage.addChild(this.image);
		this.stage.update();
	}

	else if(current_tool=="cursor"){
		//If another shape is selected, deselect it
		this.prev_selected_shape = this.selected_shape;
		if(this.selected_shape){
			this.deselect();
		}
		//set the new shape to select
		this.selected_shape = this.stage.getObjectUnderPoint(mouse[0],mouse[1]);

		//if it is a shape and not null:
		if(this.selected_shape){
			//SELECT THE SELECTED SHAPE!
			this.shape = new createjs.Shape();
			this.select();
			this.start = mouse;
			this.selected_shape_start = [this.selected_shape.x,this.selected_shape.y];
		}
	}
}

Easel.prototype.mouseUp = function(){
	this.mouseIsDown = false;

	//Shape drawing complete: Push the completed current_shape to this.shapes
	if(current_tool=="shapeDrawFill" || current_tool=="shapeDrawOutline"){
		this.shapes.push(this.current_shape);
	}
	
	//Select the image
	if(current_tool == "image"){
		this.selected_shape = this.image;
		this.stage.update();
	}
}
Easel.prototype.mouseMove = function(evt){
	//If a shapeDraw tool: Draw a shape if mouse is down and moving
	if(current_tool=="shapeDrawFill" || current_tool=="shapeDrawOutline"){
		if (this.mouseIsDown){
			this.shapeDraw(this.start,this.shape);
		}
	}
	//If draw tool: Draw (freeform) if mouseIsDown and moving
	if(current_tool == "draw"){
		if (this.mouseIsDown){
			this.draw(this.start, this.shape);
			this.start = mouse;
		}
	}
	//If cursor tool: drag and there is a selected_shape and mouseIsDown and moving
	else if(current_tool=="cursor"){
		if(this.selected_shape && this.mouseIsDown){
				this.dragOn();
		}

	}
}
Easel.prototype.doubleClick = function(){
    //Bring selected_shape to front
	this.stage.setChildIndex(this.selected_shape, this.stage.getNumChildren()-1);
	
	//Bring the selection_lines of the shape to front
	for(i=0;i<4;i++){
		this.stage.setChildIndex(this.selected_shape.selection_lines[i], this.stage.getNumChildren()-1);
	}
	//bring the corner_circles and side_circles to front
	for(i=0;i<4;i++){
		this.stage.setChildIndex(this.selected_shape.corner_circles[i], this.stage.getNumChildren()-1);
		this.stage.setChildIndex(this.selected_shape.side_circles[i], this.stage.getNumChildren()-1);
	}
	//Render graphics
	this.stage.update();
}

Easel.prototype.keyDownOrPress = function(event){
	
	//If a shape is selected, budge
	if(this.selected_shape){
		this.budge(vertical_key, horizontal_key);
	}
	if(current_tool == "text"){
		//Send to HTML element / take care of input with HTML element
		if (this.html){
			html_elem = this.html;
			this.html.oninput = function(){
			  console.log("html_elem",html_elem);
			  text_value = html_elem.value;
			  console.log(text_value);
			};
		}
	}
}

//TOOL TOGGLE FUNCTIONS: change the value of current_tool, and then deselect() any selected_shape
Easel.prototype.textTool = function(){
	current_tool = "text";
	this.deselect();
	console.log(current_tool);
}
Easel.prototype.imageTool = function(){
	current_tool = "image";
	this.deselect();
	console.log(current_tool);
}
Easel.prototype.cursorTool = function(){
	current_tool = "cursor";
	console.log(current_tool);
}
Easel.prototype.drawTool = function(){
	current_tool = "draw";
	this.deselect();
	console.log(current_tool);
}
Easel.prototype.shapeDrawFillTool = function(){
	current_tool = "shapeDrawFill";
	console.log(current_tool);
}
Easel.prototype.shapeDrawOutlineTool = function(){
	current_tool = "shapeDrawOutline";
	console.log(current_tool);
}
