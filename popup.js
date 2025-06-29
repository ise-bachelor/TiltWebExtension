document.getElementById("startBtn").addEventListener("click", async () => {
  const video = document.getElementById("video");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("カメラの起動に失敗しました:", err);
    alert("カメラが使えませんでした。");
  }
});
