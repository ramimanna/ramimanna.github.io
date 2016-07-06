var filter = document.getElementsByTagName('title')[0].text;
console.log(filter);
var front = document.getElementById("frontCanvas");
var front_ctx = front.getContext("2d");
front_ctx.fillStyle = "rgb(0,255,0)";
front_ctx.strokeStyle = "rgb(0,255,0)";
var video = document.getElementById("myVideo");

var back = document.getElementById("backingCanvas");
var back_context = back.getContext("2d");

var canvas = document.getElementById("videoCanvas");
var canvas_context = canvas.getContext("2d");

var cw = Math.floor(canvas.clientWidth);
var ch = Math.floor(canvas.clientHeight);
canvas.width = cw;
canvas.height = ch;
if(filter == "opticalflow"){
  //optical flow set up
  curr_img_pyr = new jsfeat.pyramid_t(3);
  prev_img_pyr = new jsfeat.pyramid_t(3);
  curr_img_pyr.allocate(canvas.width, canvas.height, jsfeat.U8_t|jsfeat.C1_t);
  prev_img_pyr.allocate(canvas.width, canvas.height, jsfeat.U8_t|jsfeat.C1_t);

  point_count = 0;
  point_status = new Uint8Array(100);
  prev_xy = new Float32Array(100*2);
  curr_xy = new Float32Array(100*2);    
}

img_u8 = new jsfeat.matrix_t(cw, ch, jsfeat.U8_t | jsfeat.C1_t);
if(filter == "scharr"){
  img_gxgy = new jsfeat.matrix_t(cw, ch, jsfeat.S32C2_t);      
}
if(filter == "sobel"){
  // img_u8 = new jsfeat.matrix_t(cw, ch, jsfeat.U8C1_t);
  img_gxgy = new jsfeat.matrix_t(cw, ch, jsfeat.S32C2_t);
}
video.addEventListener('playing', function(){
  draw(this,canvas_context,back_context,cw,ch);
}, false);

function draw(v,ctx,b_ctx, w,h) {
    if(v.paused || v.ended) return false;
    b_ctx.drawImage(v,0,0,w,h);
    var image_data = b_ctx.getImageData(0, 0, w, h);

    //GRAYSCALE 
    // if(filter == "grayscale" || filter == "lime" || filter=="purple" || filter == "cyan" || filter == "green" || filter == "other"){
    if(filter == "opticalflow"){    

      // swap flow data
      var _pt_xy = prev_xy;
      prev_xy = curr_xy;
      curr_xy = _pt_xy;
      var _pyr = prev_img_pyr;
      prev_img_pyr = curr_img_pyr;
      curr_img_pyr = _pyr;
      jsfeat.imgproc.grayscale(image_data.data, w, h, curr_img_pyr.data[0]);
      curr_img_pyr.build(curr_img_pyr.data[0], true);
      jsfeat.optical_flow_lk.track(prev_img_pyr, curr_img_pyr, prev_xy, curr_xy, point_count, 20|0, 30|0, point_status, 0.01, 0.001);
      prune_oflow_points(front_ctx);
      function on_canvas_click(e) {
          var coords = front.relMouseCoords(e);
          if(coords.x > 0 & coords.y > 0 & coords.x < canvas.width & coords.y < canvas.height) {
              curr_xy[point_count<<1] = canvas.width-coords.x;
              curr_xy[(point_count<<1)+1] = coords.y;
              point_count++;
          }
      }
      front.addEventListener('click', on_canvas_click, false);

      function draw_circle(f_ctx, x, y) {
          f_ctx.beginPath();
          f_ctx.arc(x, y, 4, 0, Math.PI*2, true);
          f_ctx.closePath();
          f_ctx.fill();
      }

      function prune_oflow_points(f_ctx) {
          var n = point_count;
          var i=0,j=0;

          for(; i < n; ++i) {
              if(point_status[i] == 1) {
                  if(j < i) {
                      curr_xy[j<<1] = curr_xy[i<<1];
                      curr_xy[(j<<1)+1] = curr_xy[(i<<1)+1];
                  }
                  draw_circle(f_ctx, curr_xy[j<<1], curr_xy[(j<<1)+1]);
                  ++j;
              }
          }
          point_count = j;
      }

      function relMouseCoords(event) {
          var totalOffsetX=0,totalOffsetY=0,canvasX=0,canvasY=0;
          var currentElement = this;

          do {
              totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
              totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
          } while(currentElement = currentElement.offsetParent)

          canvasX = event.pageX - totalOffsetX;
          canvasY = event.pageY - totalOffsetY;

          return {x:canvasX, y:canvasY}
      }
      HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
      $(window).unload(function() {
          video.pause();
          video.src=null;
      });
    }
    else{
      jsfeat.imgproc.grayscale(image_data.data, w, h, img_u8);
      //render result back to canvas
      var data_u32 = new Uint32Array(image_data.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols*img_u8.rows, pix = 0;
      while(--i >= 0) {
        pix = img_u8.data[i];
        if(filter == "grayscale" || filter == "scharr" || filter == "sobel"){
          data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }
        else if(filter == "yellow"){
          data_u32[i] = alpha | 0 | (pix << 8) | pix;
        }
        else if(filter == "purple"){
          data_u32[i] = alpha | (pix << 16) | 0 | pix;          
        }
        else if(filter == "cyan"){
          data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix<<16;          
        }
        else if(filter == "red"){
          data_u32[i] = alpha | pix | pix | pix;          
        }

        else if(filter == "green"){
          data_u32[i] = alpha | (pix << 8) | (pix << 8) | (pix <<8);          
        }
        else if(filter == "blue"){
          data_u32[i] = alpha | (pix << 16) | (pix << 16) | (pix <<16);          
        }

      }
    }
    if(filter == "scharr"){
      jsfeat.imgproc.grayscale(image_data.data, w, h, img_u8);
      jsfeat.imgproc.scharr_derivatives(img_u8, img_gxgy);
      //render result back to canvas
      var data_u32 = new Uint32Array(image_data.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols*img_u8.rows, pix=0, gx = 0, gy = 0;
      while(--i >= 0) {
          gx = Math.abs(img_gxgy.data[i<<1]>>2)&0xff;
          gy = Math.abs(img_gxgy.data[(i<<1)+1]>>2)&0xff;
          pix = ((gx + gy)>>2)&0xff;
          data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
      }      
    }
    if(filter == "sobel"){
      jsfeat.imgproc.grayscale(image_data.data, w, h, img_u8);
      jsfeat.imgproc.sobel_derivatives(img_u8, img_gxgy);
      //render result back to canvas
      // render result back to canvas
      var data_u32 = new Uint32Array(image_data.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols*img_u8.rows, pix=0, gx = 0, gy = 0;
      while(--i >= 0) {
          gx = Math.abs(img_gxgy.data[i<<1]>>2)&0xff;
          gy = Math.abs(img_gxgy.data[(i<<1)+1]>>2)&0xff;
          pix = ((gx + gy)>>1)&0xff;
          data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
      } 
    }
    ctx.putImageData(image_data,0,0,0,0,w,h);
    setTimeout(draw,20,v,ctx,b_ctx,w,h);
}

  // var tacking_canvas = new Canvas();
  
  //---------------------------------------------------------------------//      

  // var colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);

  // colors.on('track', function(event) {
  //   if (event.data.length === 0) {
  //     // No colors were detected in this frame.
  //   } else {
  //     event.data.forEach(function(rect) {
  //       console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
  //     });
  //   }
  // });
  if(filter == "facedetect"){
    front_ctx.lineWidth="1";
    front_ctx.strokeStyle="purple";
    var face_tracker = new tracking.ObjectTracker("face");

    face_tracker.setInitialScale(4);
    face_tracker.setStepSize(2);
    face_tracker.setEdgesDensity(0.1);

    face_tracker.on('track',function(event){
      front_ctx.clearRect(0,0,front.width,front.height);
      if(event.data.length === 0) {
      } else {
        event.data.forEach(function(rect){
          front_ctx.clearRect(0,0,front.width,front.height);
          front_ctx.beginPath();
          front_ctx.strokeRect(rect.x,rect.y,rect.width,rect.height);
          front_ctx.stroke();        
        });
      }
    });
    tracking.track('#myVideo', face_tracker);    
  }

