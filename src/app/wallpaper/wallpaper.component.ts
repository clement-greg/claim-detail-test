import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

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
    console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('body-no-scroll');

  }

  ngAfterViewInit(): void {
    // this.loaded = true;
    // setTimeout(() => window.scrollTo(0, 0), 400);
    // window.scrollTo(0, 0);
    // setTimeout(()=> {
    //   this.loaded = true;
    //   window.scrollTo(0, 0); 
    // }, 200);

    // setTimeout(()
    console.log('ngAfterViewInit')
    // setTimeout(() => this.loaded = true, 100);
  }

  @HostListener('window:scroll', ['$event'])  // for window scroll events
  onScroll(event) {
    event.preventDefault(); 
    // console.log(event);
    if (window.scrollY > 0) { 
      window.scrollTo(0, 0);
    }
  }

  checkForIt() {
    if (!document.getElementById('scroller')) {
      setTimeout(() => this.checkForIt(), 100);
      return;
    }

    window.scrollTo(0, 0);
  }

  getStarted() {
    console.log('got dsd');
    this.scrolled = true;
  }

}
