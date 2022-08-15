import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompleteAppointmentDialogComponent } from '../complete-appointment-dialog/complete-appointment-dialog.component';

@Component({
  selector: 'app-contractor-portal-maint',
  templateUrl: './contractor-portal-maint.component.html',
  styleUrls: ['./contractor-portal-maint.component.css']
})
export class ContractorPortalMaintComponent implements OnInit {

  selectedIndex = 2;
  customers: any[];
  pending: any[];
  completedJobs: any[];
  upcommingJobs: any[];

  constructor(private http: HttpClient,
    private dialog: MatDialog) {

    http.get('/assets/json/customers.json').subscribe((results: any) => {
      // console.log(results);
      for (const cust of results) {

      }
      this.customers = results;
      console.log(this.customers);
      const a = [];
      this.pending = results.slice(6, 9);

      this.upcommingJobs = results.slice(2, 8);

      this.completedJobs = results.slice(10, 12);

    });
  }

  ngOnInit(): void {
  }

  showCompleteDialog(job) {
    const ref = this.dialog.open(CompleteAppointmentDialogComponent);
    ref.afterClosed().subscribe(results=> {
      if(results) {
        job.completed = true;
      }
    });
  }

}
