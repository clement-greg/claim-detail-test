import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.css']
})
export class WallpaperComponent implements OnInit, OnDestroy, AfterViewInit {
  scrolled = false;
  loaded = false;

  constructor() { }

  ngOnInit(): void {
    document.body.classList.add('body-no-scroll');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('body-no-scroll');

  }

  ngAfterViewInit(): void {
    //this.loaded = true;
    //setTimeout(() => window.scrollTo(0, 0), 1000);
    window.scrollTo(0, 0);
    setTimeout(()=> {
      this.loaded = true;
      window.scrollTo(0, 0);
    }, 200);
  }

  getStarted() {
    console.log('got '); 
    this.scrolled = true;
  }

}
