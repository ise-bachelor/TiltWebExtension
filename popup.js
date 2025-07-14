document.getElementById("startBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // face_mesh.js と camera_utils.js の中身を読み込む
  const [faceMeshSrc, cameraUtilsSrc] = await Promise.all([
    fetch(chrome.runtime.getURL("libs/face_mesh.js")).then(res => res.text()),
    fetch(chrome.runtime.getURL("libs/camera_utils.js")).then(res => res.text()),
  ]);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: (faceMeshCode, cameraUtilsCode) => {
      // ライブラリを eval で実行
      eval(faceMeshCode);
      eval(cameraUtilsCode);

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
        locateFile: (file) => chrome.runtime.getURL("libs/" + file), // 拡張内の読み込み
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks?.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          console.log("顔の点群:", landmarks);
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
          alert("カメラ使用できませんでした: " + err.name);
        });
    },
    args: [faceMeshSrc, cameraUtilsSrc]
  });
});
