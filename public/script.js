'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const playerStart = document.getElementById('player-start');
  const playerStop = document.getElementById('player-stop');
  const recorderStart = document.getElementById('recorder-start');
  const recorderStop = document.getElementById('recorder-stop');
  const videoElement = document.getElementById('video');

  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true
    })
    .then(cameraStream => {
      const pc = new RTCPeerConnection({
        sdpSemantics: 'unified-plan'
      });
      pc.addTransceiver('video');
      pc.addTrack(cameraStream.getTracks()[0], cameraStream);
      pc.addEventListener('track', e => {
        videoElement.srcObject = e.streams[0];
      });
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() =>
          fetch('/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: pc.localDescription.sdp
          })
        )
        .then(res => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(answer => pc.setRemoteDescription(answer))
        .catch(err => console.error(err));
    });

  recorderStart.addEventListener('click', () => fetch('/recorder-start'));
  recorderStop.addEventListener('click', () => fetch('/recorder-stop'));
  playerStart.addEventListener('click', () => fetch('/player-start'));
  playerStop.addEventListener('click', () => fetch('/player-stop'));
});
