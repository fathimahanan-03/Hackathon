// ==== IMAGE UPLOAD ====
function openImageModal() {
  document.getElementById("imageModal").style.display = "flex";
  document.getElementById("uploadedImg").style.display = "none";
  document.getElementById("imagePicker").value = "";
  document.getElementById("multiImagePicker").value = "";
  document.getElementById("multiUploadedImgs").innerHTML = "";
}

function closeImageModal() {
  document.getElementById("imageModal").style.display = "none";
}

function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const img = document.getElementById("uploadedImg");
    img.src = e.target.result;
    img.style.display = "block";
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function previewMultipleImages(event) {
  const files = event.target.files;
  const container = document.getElementById("multiUploadedImgs");
  container.innerHTML = "";

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.borderRadius = "10px";
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function submitImages() {
  const files = document.getElementById("multiImagePicker").files;

  if (files.length === 0) {
    alert("No images selected!");
    return;
  }

  let csvContent = "filename,class\n";
  Array.from(files).forEach(file => {
    csvContent += `${file.name},\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Open in new tab
  window.open(url, "_blank");

  // Download
  const link = document.createElement("a");
  link.href = url;
  link.download = "images.csv";
  link.click();
}

// ==== REAL-TIME FACE DETECTION ====
let cameraStream;

function openCameraModal() {
  document.getElementById("cameraModal").style.display = "flex";
  document.getElementById("cameraContainer").style.display = "block";
  document.getElementById("capturedContainer").style.display = "none";

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      cameraStream = stream;
      const video = document.getElementById("camera");
      video.srcObject = stream;
    })
    .catch(err => alert("Camera access denied: " + err));
}

function closeCameraModal() {
  document.getElementById("cameraModal").style.display = "none";
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }
}

function capturePhoto() {
  const video = document.getElementById("camera");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const capturedImage = document.getElementById("capturedImage");
  capturedImage.src = canvas.toDataURL("image/png");

  document.getElementById("cameraContainer").style.display = "none";
  document.getElementById("capturedContainer").style.display = "block";

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }
}

function retryCamera() {
  closeCameraModal();
  openCameraModal();
}

function submitCapturedPhoto() {
  alert("Captured photo submitted successfully!");
}

// ==== AUDIO UPLOAD ====
function openAudioModal() {
  document.getElementById("audioModal").style.display = "flex";
  document.getElementById("uploadedAudio").style.display = "none";
  document.getElementById("audioPicker").value = "";
  document.getElementById("multiAudioPicker").value = "";
  document.getElementById("multiUploadedAudios").innerHTML = "";
}

function closeAudioModal() {
  document.getElementById("audioModal").style.display = "none";
}

function previewAudio(event) {
  const file = event.target.files[0];
  const audio = document.getElementById("uploadedAudio");

  if (file) {
    const audioURL = URL.createObjectURL(file);
    audio.src = audioURL;
    audio.style.display = "block";
  }
}

function previewMultipleAudios(event) {
  const files = event.target.files;
  const container = document.getElementById("multiUploadedAudios");
  container.innerHTML = "";

  Array.from(files).forEach(file => {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.style.display = "block";
    audio.style.marginTop = "10px";
    audio.src = URL.createObjectURL(file);
    container.appendChild(audio);
  });
}

function submitAudios() {
  const files = document.getElementById("multiAudioPicker").files;

  if (files.length === 0) {
    alert("No audios selected!");
    return;
  }

  let csvContent = "filename,class\n";
  Array.from(files).forEach(file => {
    csvContent += `${file.name},\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Open in new tab
  window.open(url, "_blank");

  // Download
  const link = document.createElement("a");
  link.href = url;
  link.download = "audios.csv";
  link.click();
}

// ==== REAL-TIME VOICE RECORDING ====
let mediaRecorder;
let audioChunks = [];

function openVoiceModal() {
  document.getElementById("voiceModal").style.display = "flex";
  document.getElementById("recordedContainer").style.display = "none";
}

function closeVoiceModal() {
  document.getElementById("voiceModal").style.display = "none";
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.start();

      document.querySelector("#voiceControls button:nth-child(1)").style.display = "none";
      document.querySelector("#voiceControls button:nth-child(2)").style.display = "inline-block";

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);
        const player = document.getElementById("audioPlayer");

        player.src = audioURL;
        document.getElementById("recordedContainer").style.display = "block";

        stream.getTracks().forEach(track => track.stop());
      };
    })
    .catch(err => alert("Microphone access denied: " + err));
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  document.querySelector("#voiceControls button:nth-child(2)").style.display = "none";
  document.querySelector("#voiceControls button:nth-child(1)").style.display = "inline-block";
}

function submitVoice() {
  alert("Voice recording submitted successfully!");
}
