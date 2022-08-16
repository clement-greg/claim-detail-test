import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
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
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  swipeCoord = [0, 0];
  swipeTime = new Date().getTime();

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
    ref.afterClosed().subscribe(results => {
      if (results) {
        job.completed = true;
      }
    });
  }

  @HostListener('touchstart', ['$event']) onSwipeStart($event) {
    this.onSwipe($event, 'start');
  }

  @HostListener('touchend', ['$event']) onSwipeEnd($event) {
    this.onSwipe($event, 'end');
  }

  onSwipe(e: TouchEvent, when: string) {
    this.swipe(e, when);
  }
  swipeLeft() {
    this.selectedIndex++;
    if(this.selectedIndex > 3) {
      this.selectedIndex = 0;
    }
  }

  swipeRight() {
    this.selectedIndex--;
    if(this.selectedIndex < 0) {
      this.selectedIndex = 3;
    }
  }

  swipe(e: TouchEvent, when: string): void {

    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipeDir = direction[0] < 0 ? 'next' : 'previous';
        if (swipeDir === 'next') {
          this.next.emit();
          this.swipeLeft();
        } else {
          this.previous.emit();
          this.swipeRight();
        }
      }
    }
  }

}
