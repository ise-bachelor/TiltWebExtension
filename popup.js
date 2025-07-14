document.getElementById("startBtn").addEventListener("click", async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      navigator.mediaDevices.getUserMedia({ video: true })
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
        })
        .catch(err => alert("カメラ使用を許可してください: " + err.name));
    }
  });
});