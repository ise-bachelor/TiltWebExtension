document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const startBtn = document.getElementById("startBtn");

  startBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error("カメラの起動に失敗:", err);
      console.log(err);
      alert("カメラが使えませんでした。");
    }
  });
});
