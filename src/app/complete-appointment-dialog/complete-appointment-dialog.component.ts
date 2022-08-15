import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-appointment-dialog',
  templateUrl: './complete-appointment-dialog.component.html',
  styleUrls: ['./complete-appointment-dialog.component.css']
})
export class CompleteAppointmentDialogComponent implements OnInit {

  selectedIndex = 0;

  saving = false;
  constructor(public dialogRef: MatDialogRef<CompleteAppointmentDialogComponent>) { }

  ngOnInit(): void {
  }

  doComplete()  {
    this.saving = true;
    setTimeout(()=> {

      this.saving = false;
      this.selectedIndex = 1;
      setTimeout(()=> {
        this.dialogRef.close(true);
      }, 2500);
    }, 1000);
  }

}
