import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-camera',
  templateUrl: './test-camera.component.html',
  styleUrls: ['./test-camera.component.css']
})
export class TestCameraComponent implements OnInit {

  streamStarted = false;

  constructor() { }

  ngOnInit(): void {
  }

  async test() {
    this.startStream();
  }

  async startStream() {
    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440
        },
        facingMode: 'environment'
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.handleStream(stream);
  }

  async handleStream(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
    // play.classList.add('d-none');
    // pause.classList.remove('d-none');
    // screenshot.classList.remove('d-none');
    this.streamStarted = true;
  }

  doScreenshot() {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    console.log(canvas.toDataURL('image/webp'));

    (document.getElementById('screenshot') as any).src = canvas.toDataURL('image/webp');
    video.pause();
  }

}
