  var filter = "scharr";
  var front = document.getElementById("myCanvas");
  var front_ctx = front.getContext("2d");

  var video = document.getElementById("myVideo");

  var back = document.getElementById("backingCanvas");
  var back_context = back.getContext("2d");

  var canvas = document.getElementById("videoCanvas");
  var canvas_context = canvas.getContext("2d");

document.addEventListener('DOMContentLoaded', function(){
    // var v = document.getElementById('v');
    // var canvas = document.getElementById('c');
    // var context = canvas.getContext('2d');

    var cw = Math.floor(canvas.clientWidth);
    var ch = Math.floor(canvas.clientHeight);
    canvas.width = cw;
    canvas.height = ch;
    if (filter=="grayscale" || filter == "scharr" || filter == "sobel"){
      img_u8 = new jsfeat.matrix_t(cw, ch, jsfeat.U8_t | jsfeat.C1_t);
    }
    if(filter == "scharr"){
      img_gxgy = new jsfeat.matrix_t(cw, ch, jsfeat.S32C2_t);      
    }
    if(filter == "sobel"){
      // img_u8 = new jsfeat.matrix_t(cw, ch, jsfeat.U8C1_t);
      img_gxgy = new jsfeat.matrix_t(cw, ch, jsfeat.S32C2_t);
    }

    video.addEventListener('playing', function(){
        draw(this,canvas_context,back_context,cw,ch);
    },false);

},false);

function draw(v,ctx,b_ctx,w,h) {
    if(v.paused || v.ended) return false;
    b_ctx.drawImage(v,0,0,w,h);
    var image_data = b_ctx.getImageData(0, 0, w, h);

    //WITH JSFEAT:
    
    //GRAYSCALE 
    if(filter == "grayscale"){

      jsfeat.imgproc.grayscale(image_data.data, w, h, img_u8);
      //render result back to canvas
      var data_u32 = new Uint32Array(image_data.data.buffer);
      var alpha = (0xff << 24);
      var i = img_u8.cols*img_u8.rows, pix = 0;
      while(--i >= 0) {
        pix = img_u8.data[i];
        data_u32[i] = alpha | (pix/2 << 16) | (pix << 8) | pix;
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


    //WITH PURE HTML5/JS:

    // var data = image_data.data;
    // for(var i = 0; i < data.length; i+=4) {
    //     var r = data[i];
    //     var g = data[i+1];
    //     var b = data[i+2];
    //     var brightness = (3*r+4*g+b)>>>3;
    //     data[i] = brightness;
    //     data[i+1] = brightness;
    //     data[i+2] = brightness;
    // }
    // image_data.data = data;
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

  // tracking.track('#myVideo', face_tracker);