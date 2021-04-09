import { Component, ViewChild, OnChanges, ElementRef, Input, SimpleChanges, AfterViewChecked, OnDestroy, AfterViewInit } from '@angular/core';
import { UtilitiesService } from '../utilities';
// import { UtilitiesService } from '@upkeeplabs/services';

@Component({
    templateUrl: './circle-widget-small.component.html',
    selector: 'app-circle-widget-small',
    styleUrls: ['./circle-widget-small.component.css']
})
export class CircleWidgetSmallComponent implements AfterViewInit {

    @Input() percent: number;
    @Input() label: string;
    @Input() number: string;
    @Input() showNumber = true;
    @Input() strokeWidth = 7;
    @Input() strokeCircleWidth = 5;
    @Input() strokeColor = '#58bf74';
    @Input() height = 100;
    @Input() iconClass: string;
    outerCircleId = UtilitiesService.newid();
    innerCircleId = UtilitiesService.newid();


    ngAfterViewInit(): void {
        const outerCircle = document.getElementById(this.outerCircleId);
        const innerCircle = document.getElementById(this.innerCircleId);

        if(!outerCircle || !innerCircle) {
            return;
        }
        outerCircle.setAttribute('r', this.radius.toString());
        innerCircle.setAttribute('r', this.radius.toString());
        outerCircle.setAttribute('cx', this.containerMid.toString());
        outerCircle.setAttribute('cy', this.containerMid.toString());
        innerCircle.setAttribute('cx', this.containerMid.toString());
        innerCircle.setAttribute('cy', this.containerMid.toString());
    }

    get archCircumferenceBound() {
        return this.dashArray - (this.dashArray * (this.percent / 100));
    }

    get containerHeight() {
        return `${this.height + (this.strokeWidth * 2)}px`;
    }

    get containerMid() {
        return (this.height + (this.strokeWidth * 2)) / 2;
    }

    get radius() {
        return this.height / 2;
    }

    get dashArray() {
        return 2 * Math.PI * this.radius;
    }
}
