import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'my-claim-summary',
  templateUrl: './claim-summary.component.html',
  styleUrls: ['./claim-summary.component.css']
})
export class ClaimSummaryComponent implements OnInit {

  @Input()
  workOrderSummary: any;

  @Input() jobItems: any[];

  constructor( ) { }

  ngOnInit() {}

  claimSummaryExpanded = false;

  getEntityThumbnailUrl(entityId: string) {
    return `https://test-api.upkeeplabs.com/api/entity/thumbnail/f9c89291-1433-40d0-b04d-3a6c1420af96`;
  }

  getItemThumbnailUrl(itemId: string) {
    return `https://api.elevatehw.com/api/WorkOrderItem/e5628f87-f9c2-48fb-b728-12c82f9d9830/Photo`;
  }

  get hasPlusCount() {
    return this.jobItems && this.jobItems.length > 1;
  }

  get plusCount() {
    if(!this.jobItems) {
      return 0;
    }

    return this.jobItems.length - 1;
  }

}
