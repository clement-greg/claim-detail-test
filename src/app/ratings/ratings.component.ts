import { Component, HostListener, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  isScrolled = false;
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
      this.zone.run(() => {
          this.isScrolled = window.scrollY > 0;
          // this.scrollPosition = window.scrollY;

      });
  }

  onScroll(evt) {
    
    console.log(evt);
    this.isScrolled = evt.srcElement.scrollTop > 0;
  }

}
