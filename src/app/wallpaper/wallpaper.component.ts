import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.css']
})
export class WallpaperComponent implements OnInit, OnDestroy {
  scrolled = false;

  constructor() { }

  ngOnInit(): void {
    document.body.classList.add('body-no-scroll');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('body-no-scroll');
    
  }

  getStarted() {
    console.log('got started');
    this.scrolled = true;
  }

}
