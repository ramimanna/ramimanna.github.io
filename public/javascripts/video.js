console.log("JS AT YO SERVICE BROTHHA");
var video = document.querySelector("#myVideo");
 
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
if (navigator.getUserMedia) {       
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}
 
function handleVideo(stream) {
	console.log("handling video");
	console.log(stream);
	console.log(stream.getTracks());
    video.src = window.URL.createObjectURL(stream);
    // console.log(stream);
}
 
function videoError(e) {
    // do something
}