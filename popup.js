document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startBtn");
  const video = document.getElementById("video");

  btn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error("カメラの起動に失敗しました:", err);
      alert("カメラが使えませんでした。");
    }
  });
});
