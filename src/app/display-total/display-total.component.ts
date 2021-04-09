import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-display-total',
    templateUrl: './display-total.component.html',
    styleUrls: ['./display-total.component.css']
})
export class DisplayTotalComponent implements OnInit {

    @Input() total: number;
    @Input() label = 'Total';
    @Input() symbol = '$';
    @Input() suffix = '';
    @Input() showWarning: boolean;
    @Input() hideTriangle = false;

    constructor() { }

    ngOnInit() {
    }

    get dollars(): number {
        if (this.total !== undefined) {
            return parseInt(this.total.toString(), 10);
        } else {
            return 0;
        }
    }

    get cents(): number {
        let cents = this.total % this.dollars;
        if (isNaN(cents)) {
            cents = 0;
        }

        return cents * 100;
    }

}
