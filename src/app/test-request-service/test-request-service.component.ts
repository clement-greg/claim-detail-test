import { HttpClient } from '@angular/common/http';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { StripeCardModel } from '../payment-method-entry/payment-method-entry.component';

@Component({
  selector: 'app-test-request-service',
  templateUrl: './test-request-service.component.html',
  styleUrls: ['./test-request-service.component.css']
})
export class TestRequestServiceComponent implements OnInit {

  mappedExpenses: any[];
  workOrderItems: any[];
  policySummary: any;
  pct = 0;
  isScrolled = false;
  selectedIndex = 0;
  existingCards: StripeCardModel[];
  xml: string;
  constructor(
    private zone: NgZone, private http: HttpClient) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {


    window.scrollTo(0, 0);
    this.http.get('/assets/json/policy-service-offering.json').subscribe((results: any) => {
      this.workOrderItems = results;
    });

    this.http.get('/assets/json/policy-summary.json').subscribe((ps: any) => {
      this.policySummary = ps;
    });

    this.http.get('/assets/json/work-order-process.json').subscribe((results: any) => {
      console.log(results);
      this.xml = results.data;
    });

    const visaCard = new StripeCardModel();
    visaCard.brand = 'Visa';
    visaCard.last4 = '3838';
    visaCard.customer = 'Bob Johnson';
    visaCard.exp_month = 10;
    visaCard.exp_year = 2030;
    this.existingCards = [];

    var mastercard = new StripeCardModel();
    mastercard.brand = 'MasterCard';
    mastercard.last4 = '4875';
    mastercard.customer = 'Jill Mills';
    mastercard.exp_month = 8;
    mastercard.exp_year = 2025;

    this.existingCards.push(visaCard);
    this.existingCards.push(mastercard);
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
