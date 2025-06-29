document.documentElement.style.transform = "rotate(5deg)";
document.documentElement.style.transformOrigin = "top left";
const faceVideo = document.getElementById("faceVideo");
faceVideo.removeAttribute("style");
faceVideo.style.position = "fixed";
faceVideo.style.bottom = "3px";
faceVideo.style.right = "3px";

