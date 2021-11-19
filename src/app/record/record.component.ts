import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
declare var MediaRecorder: any;
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  mediaRecorder: typeof MediaRecorder;
  recording: boolean = false;

  recordings: any[] = [];
  constructor(private santizer: DomSanitizer,
    private http: HttpClient,
    private zone: NgZone) { }

  ngOnInit(): void { }

  stop(evt: MouseEvent) {
    if (evt.button === 0 || evt.type === 'touchend') {
      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
        this.recording = false;
      }
    }
  }

  removeRecording(recording) {
    this.recordings.splice(this.recordings.indexOf(recording), 1);
  }

  doRecord(evt: MouseEvent) {
    if (evt.button === 0 || evt.type === 'touchstart') {
      evt.preventDefault();
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          this.recording = true;
          let chunks = [];
          this.mediaRecorder.ondataavailable = e => {
            chunks.push(e.data);
          };

          this.mediaRecorder.onstop = async e => {

            const arrayBuffer = await new Response(chunks[0]).arrayBuffer();
            let headers: HttpHeaders = new HttpHeaders();
            headers = headers.set('content-type', 'application/octet-stream');

            this.http.post('https://local.upkeeplabs.com:5002/api/test/echo-bytes', arrayBuffer).subscribe(results => {
              const arrayBuffer = this.base64ToArrayBuffer(results);
              const blob = new Blob([new Uint8Array(arrayBuffer)]);
              const audioURL = window.URL.createObjectURL(blob);


              this.zone.run(() => {
                this.recordings.push(this.santizer.bypassSecurityTrustUrl(audioURL));
              });
            });
            chunks = [];
          }
        }).catch(err => {
          console.error(err);
        });
      }
    }
  }

  base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
