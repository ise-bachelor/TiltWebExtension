document.getElementById("startBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [
      "libs/face_mesh.js",
      "libs/camera_utils.js"
    ],
    func: () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.autoplay = true;
          video.style.position = "fixed";
          video.style.top = "50%";
          video.style.left = "50%";
          video.style.transform = "translate(-50%, -50%)";
          video.style.zIndex = "10000";
          video.style.width = "300px";
          document.body.appendChild(video);

          const faceMesh = new FaceMesh({
            locateFile: (file) => `libs/${file}`,
          });

          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          faceMesh.onResults(results => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              const landmarks = results.multiFaceLandmarks[0];
              console.log("顔の点群:", landmarks);
              const nose = landmarks[1];
              console.log("鼻の位置:", nose.x, nose.y);
            }
          });

          const camera = new Camera(video, {
            onFrame: async () => {
              await faceMesh.send({ image: video });
            },
            width: 300,
            height: 225
          });

          camera.start();
        })
        .catch(err => alert("カメラ使用を許可してください: " + err.name));
    }
  });
});