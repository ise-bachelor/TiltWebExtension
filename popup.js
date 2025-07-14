document.getElementById("startBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        // MediaPipeのライブラリを読み込む
        const loadScript = (src) =>
          new Promise((resolve) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            document.head.appendChild(s);
          });

        Promise.all([
          loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"),
          loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js")
        ]).then(() => {
          const video = document.createElement("video");
          video.style.position = "fixed";
          video.style.top = "50%";
          video.style.left = "50%";
          video.style.transform = "translate(-50%, -50%)";
          video.style.zIndex = "10000";
          video.style.width = "300px";
          video.style.height = "225px";
          video.autoplay = true;
          video.playsInline = true;
          document.body.appendChild(video);

          const faceMesh = new FaceMesh({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
          });

          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          faceMesh.onResults((results) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              const landmarks = results.multiFaceLandmarks[0];
              console.log("顔の点群（468点）:", landmarks);

              // 例: 鼻の点の位置（点1）
              const nose = landmarks[1];
              console.log("鼻位置:", nose.x, nose.y);
            }
          });

          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              video.srcObject = stream;

              const camera = new Camera(video, {
                onFrame: async () => {
                  await faceMesh.send({ image: video });
                },
                width: 300,
                height: 225,
              });

              camera.start();
            })
            .catch((err) => {
              alert("カメラ使用を許可してください: " + err.name);
            });
        });
      }
    });
  });
});
