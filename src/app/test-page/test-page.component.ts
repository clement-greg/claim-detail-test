import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Metric } from '../doughnut/doughnut.component';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  mappedExpenses: any[];
  isScrolled = false;
  pct = 0;
  constructor(private zone: NgZone) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {

    setTimeout(() => {
      // constructor(public name: string, public value: number, public color: string = null) 
      this.mappedExpenses = [];
      this.mappedExpenses.push(new Metric('HVAC', 450, '#9600FF'));
      this.mappedExpenses.push(new Metric('Plumbing', 980, '#AEBAF8'));
      this.pct = 75;
    }, 500);
  }

  get expensesLabel() {
    return 'Total Savings';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.zone.run(() => {
      this.isScrolled = window.scrollY > 0;
      // this.scrollPosition = window.scrollY;

    });
  }

  public scrollToAnchor(location: string, wait: number): void {
    const element = document.querySelector('#' + location)
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }, wait)
    }
  }

}
