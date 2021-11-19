import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'claim-detail-test';
  enteringAnimation = false;
  constructor(
    private router: Router) {

  }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        const nav = val as NavigationEnd;

        if (nav && nav.url && nav.url.indexOf('#') === -1) {
          this.enteringAnimation = true;
        }

        setTimeout(() => this.enteringAnimation = false, 750);
        console.log('here')
        setTimeout(() => window.scrollTo(0, 0),185);
      }
    });
  }
}
