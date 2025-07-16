document.documentElement.style.transform = "rotate(5deg)";
document.documentElement.style.transformOrigin = "center center";

const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.position = "fixed";
video.style.top = "50%";
video.style.left = "50%";
video.style.transform = "translate(-50%, -50%)";
video.style.zIndex = "10000";
video.style.width = "300px";
video.style.height = "225px";
document.body.appendChild(video);

// 動的にMediaPipeの内部挙動を再確認
const testUrl = chrome.runtime.getURL("libs/face_mesh_solution_packed_assets.data");
fetch(testUrl)
  .then(res => {
    if (res.ok) {
      console.log("✅ .dataファイルが fetch できました");
    } else {
      console.error("❌ .dataファイルが fetch できません: ", res.status);
    }
  })
  .catch(err => console.error("❌ fetch エラー:", err));


const faceMesh = new FaceMesh({
  locateFile: (file) => {
    console.log("MediaPipe がファイルを探しています:", file);
    return chrome.runtime.getURL("libs/" + file);
  }
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(results => {
  if (results.multiFaceLandmarks?.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    const nose = landmarks[1];
    console.log("鼻の位置:", nose);

    chrome.runtime.sendMessage({
      type: "nose_position",
      x: nose.x,
      y: nose.y
    });
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
      height: 225
    });
    camera.start();
  })
  .catch((err) => {
    console.error("カメラ起動失敗:", err);
  });


