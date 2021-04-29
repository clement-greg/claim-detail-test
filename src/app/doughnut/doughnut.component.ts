import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UtilitiesService } from '../utilities';


export class Metric {
    constructor(public name: string, public value: number, public color: string = null) { }
    public allMetrics: Metric[];
    public radius: number;
    private archCircumferencePrivate = 0;

    private get circumference() {
        return this.radius * 2 * Math.PI;
    }

    get percent() {
        const total = this.allMetrics.map(i => i.value).reduce((a, b) => a + b);

        if (total === 0) {
            return 0;
        }

        return this.value / total;
    }

    get total() {
        return this.allMetrics.map(i => i.value).reduce((a, b) => a + b);
    }

    get arcCircumference() {
        if (this.total === 0) {
            return 0;
        }

        return this.value * (this.circumference / this.total);
    }

    public activate() {
        this.archCircumferencePrivate = this.arcCircumference;
    }

    get archCircumferenceBound() {
        return this.circumference - this.archCircumferencePrivate;
    }

    get arcDegrees() {
        if (this.circumference === 0) {
            return 0;
        }
        return (360 / this.circumference) * this.arcCircumference;
    }

    get rotate() {
        const beforeMetrics = this.allMetrics.filter(i => this.allMetrics.indexOf(i) < this.allMetrics.indexOf(this));
        let rotate = -90;
        if (beforeMetrics.length > 0) {
            rotate += beforeMetrics.map(i => i.arcDegrees).reduce((a, b) => a + b);
        }


        return `rotate(${rotate}deg)`;
    }
}

@Component({
    selector: 'app-doughnut',
    templateUrl: './doughnut.component.html',
    styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit, OnChanges {

    canvasId = UtilitiesService.newid();
    colors = [
        '#9600FF', '#AEBAF8', 'blue', 'orange', 'purple', 'yellow'
    ];

    @Input() metrics: Metric[];
    @Input() label = 'Total Savings';
    transformedMetrics: Metric[];
    totalDisplay = 0;
    savingsInterval: any;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.metrics && changes.metrics.currentValue) {
            this.metrics = changes.metrics.currentValue;
            this.transformedMetrics = this.metrics.map(i => new Metric(i.name, i.value, i.color));
            for (const metric of this.transformedMetrics) {
                metric.allMetrics = this.transformedMetrics;
                metric.radius = 96;
            }
            setTimeout(() => {
                for (const metric of this.transformedMetrics) {
                    metric.activate();
                }
            }, 100);

            const chunk = this.total / 20;
            this.totalDisplay = 0;

            this.savingsInterval = setInterval(() => {
                if (this.totalDisplay < this.total) {
                    this.totalDisplay += chunk;
                } else {
                    clearInterval(this.savingsInterval);
                    this.totalDisplay = this.total;
                }
            }, 50);
        }
    }

    get total() {
        if (!this.metrics || this.metrics.length === 0) {
            return 0;
        }

        return this.metrics.map(i => i.value).reduce((a, b) => a + b);
    }
}
