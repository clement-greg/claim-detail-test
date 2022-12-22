import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TestCameraComponent),
  multi: true
};

const noop = () => { };

@Component({
  selector: 'app-test-camera',
  templateUrl: './test-camera.component.html',
  styleUrls: ['./test-camera.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TestCameraComponent implements OnInit, ControlValueAccessor {

  streamStarted = false;
  cameraRunning = false;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor() { }
  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
  }

  async startCamera() {
    this.cameraRunning = true;
    setTimeout(()=> {

      this.startStream();
    });
  }

  async startStream() {
    console.log({width: window.innerWidth, height: window.innerHeight})
    const constraints = {
      video: {
        width: screen.width,
        height: screen.height,
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
    //console.log(canvas.toDataURL('image/webp'));
    this.onChangeCallback(canvas.toDataURL('image/webp'));

    //(document.getElementById('screenshot') as any).src = canvas.toDataURL('image/webp');
    video.pause();
    setTimeout(()=> this.cameraRunning = false, 500);
    //this.cameraRunning = false;
  }

  closeCamera() {
    
    const video = document.querySelector('video');
    video.pause();
    this.cameraRunning = false;
  }

}
