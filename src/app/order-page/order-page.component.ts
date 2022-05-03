import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilitiesService } from '../utilities';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  plans: any[];
  hasScrollers = false;
  id = UtilitiesService.newid();
  isYearly = false;
  constructor(private http: HttpClient,
    private sanitization: DomSanitizer) { }

  ngOnInit(): void {
    this.http.get(`/assets/json/plan-selection.json`).subscribe((results: any) => {
      console.log(results);
      this.plans = results;
      setTimeout(() => {
        this.setScrollers();
        this.setBestvalueScroll();
      }, 100);
    });
  }

  getCardFronBackground(plan) {

    if (!plan.planStyleObj) {
      plan.planStyleObj = JSON.parse(plan.planStyle);

    }

    return plan.planStyleObj.cardFrontBackgroundImage;
  }

  getSampleContractUrl(item: any) {
    return ''//ApiService.endPoint + `Plan/${item.id}/contract/pdf`;
  }

  @HostListener('window:resize') onWindowResize() {
    this.setScrollers();
  }

  setScrollers() {
    const container = document.getElementById(this.id);

    this.hasScrollers = container.clientWidth < container.scrollWidth;


  }

  private setBestvalueScroll() {
    const bestValuePlan = this.plans.find(i => i.bestValue);

    const bestValueIndex = this.plans.indexOf(bestValuePlan);
    const scrollLeft = bestValueIndex * 310;
    document.getElementById(this.id).scrollTo({ left: scrollLeft, top: 0, behavior: 'smooth' });
  }

  scrollContainer;
  get isLeftScrolled() {
    if (!this.scrollContainer) {
      this.scrollContainer = document.getElementById(this.id);
    }


    return this.scrollContainer.scrollLeft === 0;
  }

  get isRightScrolled() {
    if (!this.scrollContainer) {
      this.scrollContainer = document.getElementById(this.id);
    }
    //console.log(this.scrollContainer.scrollLeft);

    // console.log({left: this.scrollContainer.scrollLeft, offsetWidth: this.scrollContainer.offsetWidth, scrollWidth: this.scrollContainer.scrollWidth})

    return this.scrollContainer.scrollLeft + this.scrollContainer.offsetWidth === this.scrollContainer.scrollWidth;
  }

  scrollLeft() {
    const el = document.getElementById(this.id);
    el.scrollTo({ left: el.scrollLeft - 200, top: 0, behavior: 'smooth' });
  }

  scrollRight() {
    const el = document.getElementById(this.id);
    el.scrollTo({ left: el.scrollLeft + 200, top: 0, behavior: 'smooth' });
  }


  selectPlan(plan) {
    const el = document.getElementById(plan.id);

    el.scrollIntoView({ behavior: 'smooth' });
  }

  updateScrollStatus() {

  }

  getBackground(background: string) {
    return this.sanitization.bypassSecurityTrustStyle(background);
  }
}

