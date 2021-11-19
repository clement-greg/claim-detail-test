import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-service-request-summary',
    templateUrl: './service-request-summary.component.html',
    styleUrls: ['./service-request-summary.component.css']
})
export class ServiceRequestSummaryComponent implements OnInit, OnChanges {


    @Input() policySummary: any;
    @Input() serviceFeeOverride: number;
    // @Input() selectedItem: WorkOrderItem;
    @Input() selectedIndex: number;
    @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter();
    @Input() totalSteps: number;
    @Input() selectedCard: any;
    @Input() selectedTimeSlots: any[];
    @Input() lineItems: any[];

    planStyle: any;

    constructor( private sanitization: DomSanitizer,
        private router: Router) { }

    ngOnInit() {

    }

    getBackground() {
        if (!this.planStyle) {
            return null;
        }

        const planStyleObj = JSON.parse(this.planStyle.style);
        if (planStyleObj) {
            return this.sanitization.bypassSecurityTrustStyle(planStyleObj.cardBackBackgroundImage);
        }
        return null;
    }

    get pctComplete() {
        if (this.totalSteps === 0) {
            return 0;
        }
        return (this.selectedIndex / this.totalSteps) * 100;
    }

    get serviceFee() {
        if (this.serviceFeeOverride != null && this.serviceFeeOverride !== undefined) {
            return this.serviceFeeOverride;
        }
        if (!this.policySummary) {
            return null;
        }

        return this.policySummary.serviceFeeAmount;
    }

    get itemNames() {
        if(!this.lineItems) {
            return null;
        }

        return this.lineItems.map(i=>i.itemName).join(', ');
    }

    async ngOnChanges(changes: SimpleChanges) {

    }

    getItemUrl() {
        return `https://dev-api.upkeeplabs.com/api/WorkOrderItem/ca7b6e7a-8810-4fbd-8b81-7e6d14b8e9d1/photo`;
    }

    getLeftMargin(lineItem: any) {
        return (this.lineItems.indexOf(lineItem) * 10) + 'px';
    }

    get propertyUrl() {
        if (!this.policySummary) {
            return null;
        }

        return `https://dev-api.upkeeplabs.com/api/policy/3f501c6e-f2f1-402b-89cf-7af8358a7cbe/StreetView`;
    }

    goToPropertySelection() {

    }

    goToStep(index) {
        this.selectedIndex = index;
        this.selectedIndexChange.emit(index);
    }

    get cardImage() {
        if (!this.selectedCard) {
            return null;
        }
        if (this.selectedCard.brand === 'Visa') {
            return 'assets/images/visa.png';
        }
        if (this.selectedCard.brand === 'MasterCard') {
            return 'assets/images/mastercard.png';

        }
        if (this.selectedCard.brand === 'Discover') {
            return 'assets/images/discover.png';

        }
        if (this.selectedCard.brand === 'American Express') {
            return 'assets/images/americanexpress.png';

        }
    }
}
