import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-job-items-status',
  templateUrl: './edit-job-items-status.component.html',
  styleUrls: ['./edit-job-items-status.component.css']
})
export class EditJobItemsStatusComponent implements OnInit {

  jobItems: any[];
  newStatus: string;
  saving = false;
  workOrderStatuses: any[];

  //
  constructor(public dialogRef: MatDialogRef<EditJobItemsStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,) { }

  ngOnInit(): void {
    this.http.get('/assets/json/work-order-status.json').subscribe((results: any) => {
      // console.log(results);
      this.workOrderStatuses = results;

    });

    this.jobItems = this.data.allItems;
    if (!this.data.item) {
      for (const item of this.data.allItems) {
        item.selected = true;
      }
    } else {
      for (const item of this.data.allItems) {
        item.selected = false;
      }
      const foundItem = this.data.allItems.find(i => i.id === this.data.item.id);
      console.log({ foundItem });

      if (foundItem) {
        foundItem.selected = true;
      }
    }
    console.log(this.data);
  }

  get canUpdate() {
    return this.newStatus && this.jobItems.find(i => i.selected) && !this.saving;
  }

  save() {
    const jobStatus = this.workOrderStatuses.find(i => i.id === this.newStatus);
    for (const item of this.jobItems) {
      if (item.selected) {

        item.status = jobStatus.name;
        item.iconClass = jobStatus.iconClass;
        item.statusNumber = jobStatus.number;
        item.percent = (item.statusNumber / 5) * 100;
      }
    }
    //this.addNewStatus(results.status, results.jobItems);
    this.dialogRef.close({
      status: jobStatus.name,
      jobItems: this.jobItems.filter(i => i.selected),
    });
  }

}
