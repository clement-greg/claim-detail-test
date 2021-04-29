import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  headshotUrl = '';
  isScrolled = false;
  flipped = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  handleFiles(files, target) {
    if (files.srcElement) {
      files = files.srcElement.files;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      //this.imageType = file.type;
      const imageType = /^image\//;

      if (!imageType.test(file.type)) {
        continue;
      }
      const reader = new FileReader();

      const setUrl = (url) => {
        // this.url = url;
        // this.urlChange.emit(this.url);
        const items = document.getElementsByClassName(target + '-image');
        for(let i = 0;i<items.length;i++){
          (items[i] as any).src = url;
        }
        //(document.getElementById(target + '-image') as any).src = url;

      };
      reader.onload = (function () {
        return function (e) {

          this.dragTargetActive = false;
          setUrl(e.target.result);

        };
      })();

      reader.readAsDataURL(file);
    }
  }

  showFileUpload(id) {
    document.getElementById(id).click();
  }

}
