import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Metric } from '../doughnut/doughnut.component';

@Component({
  selector: 'app-test-customer-portal',
  templateUrl: './test-customer-portal.component.html',
  styleUrls: ['./test-customer-portal.component.css']
})
export class TestCustomerPortalComponent implements OnInit {
  mappedExpenses: any[];
  pct = 0;
  isScrolled = false;
  constructor(
    private zone: NgZone) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    setTimeout(() => {
      // constructor(public name: string, public value: number, public color: string = null) 
      this.mappedExpenses = [];
      this.mappedExpenses.push(new Metric('HVAC', 450, '#9600FF'));
      this.mappedExpenses.push(new Metric('Plumbing', 980, '#AEBAF8'));
      this.pct = 75;
      window.scrollTo(0, 0);
    }, 3000);
    
    window.scrollTo(0, 0);
  }

  get expensesLabel() {
    return 'Total Savings';
  }

  handleClick() {
    alert('fires');
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {

    this.zone.run(() => {
      // this.isScrolled = document.getElementById('background').scrollTop > 0;
      this.isScrolled = window.scrollY > 0;

    });
  }

}
