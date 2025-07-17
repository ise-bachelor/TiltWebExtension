document.getElementById("startBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [
      "libs/face_mesh_solution_wasm_bin.js",
      "libs/face_mesh_solution_packed_assets_loader.js",
      "libs/face_mesh.js",
      "content.js",
      "libs/camera_utils.js"
    ]
  });
});
