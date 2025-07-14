chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "nose_position") {
    console.log("受信した鼻座標:", msg.x, msg.y);
    // 必要に応じて処理（保存、通知、Python連携など）
  }
});
