// ==== IMAGE UPLOAD ====
function openImageModal() {
  document.getElementById("imageModal").style.display = "flex";
}
function closeImageModal() {
  document.getElementById("imageModal").style.display = "none";
  document.getElementById("uploadedImg").style.display = "none";
}
function previewImage(event) {
  let file = event.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = e => {
      let img = document.getElementById("uploadedImg");
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// ==== CAMERA ====
let videoStream;
function openCameraModal() {
  document.getElementById("cameraModal").style.display = "flex";
  let video = document.getElementById("camera");
  let canvas = document.getElementById("capturedPhoto");
  let controls = document.getElementById("cameraControls");
  let retry = document.getElementById("retryControls");

  video.style.display = "block";
  canvas.style.display = "none";
  controls.style.display = "block";
  retry.style.display = "none";

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;
    })
    .catch(err => alert("Camera access denied: " + err));
}
function closeCameraModal() {
  document.getElementById("cameraModal").style.display = "none";
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}
function capturePhoto() {
  let video = document.getElementById("camera");
  let canvas = document.getElementById("capturedPhoto");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Hide video, show captured image
  video.style.display = "none";
  canvas.style.display = "block";
  document.getElementById("cameraControls").style.display = "none";
  document.getElementById("retryControls").style.display = "block";

  // Stop camera stream
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}
function retryCamera() {
  closeCameraModal();
  openCameraModal();
}

// ==== AUDIO UPLOAD ====
function openAudioModal() {
  document.getElementById("audioModal").style.display = "flex";
}
function closeAudioModal() {
  document.getElementById("audioModal").style.display = "none";
  document.getElementById("uploadedAudio").style.display = "none";
}
function previewAudio(event) {
  let file = event.target.files[0];
  if (file) {
    let player = document.getElementById("uploadedAudio");
    player.src = URL.createObjectURL(file);
    player.style.display = "block";
  }
}

// ==== VOICE RECORDING ====
let mediaRecorder;
let audioChunks = [];
function openVoiceModal() {
  document.getElementById("voiceModal").style.display = "flex";
  startRecording();
}
function closeVoiceModal() {
  document.getElementById("voiceModal").style.display = "none";
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}
function startRecording() {
  let countdownEl = document.getElementById("countdown");
  let player = document.getElementById("audioPlayer");
  player.style.display = "none";

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      audioChunks = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        let audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        let audioURL = URL.createObjectURL(audioBlob);
        player.src = audioURL;
        player.style.display = "block";
      };

      // countdown
      let seconds = 7;
      countdownEl.innerText = seconds;
      let timer = setInterval(() => {
        seconds--;
        countdownEl.innerText = seconds;
        if (seconds <= 0) {
          clearInterval(timer);
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }
      }, 1000);
    })
    .catch(err => alert("Microphone access denied: " + err));
}
