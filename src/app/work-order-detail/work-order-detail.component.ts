import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from '../utilities';
import { WorkOrderNote } from '../work-order-note.model';
import { WorkOrderSummary } from '../work-order.model';
import { WorkOrderJobItem } from '../work-order-job-item.model';
import { MatDialog } from '@angular/material/dialog';
import { EditJobItemsStatusComponent } from '../edit-job-items-status/edit-job-items-status.component';
import { ContractorInvoice } from '../contractor-invoice.model';

export class StatusItem {
  constructor(public description: string, public iconClass: string, public complete: boolean = false, public subStatus: string = ' ') {

  }
}


@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent implements OnInit {

  workOrderSummary: any;
  statusHistory: any[];
  notes: any[];
  jobItems: any[];
  resolution: string;
  completedDate: Date = new Date();
  survey: any;

  @Input() selectedIndex = 0;

  steps: StatusItem[] = [
    new StatusItem('Transmitted', 'send'),
    new StatusItem('Scheduled', 'today'),
    new StatusItem('Dispatched', 'local_shipping'),
    new StatusItem('Authorized', 'gavel'),
    new StatusItem('Completed', 'check'),
    new StatusItem('Invoiced', 'monetization_on'),
  ];
  apptDate: Date = new Date();
  startWindow = '8 AM';
  endWindow = '1 PM';

  preSelectDates = [
    new DateSelection(new Date()),
    new DateSelection(new Date(), 1),
    new DateSelection(new Date(), 2),
    new DateSelection(new Date(), 3),
    new DateSelection(new Date(), 4),
    new DateSelection(new Date(), 5),
  ];

  invoice: ContractorInvoice = new ContractorInvoice();

  constructor(private http: HttpClient,
    private dialog: MatDialog) {

    http.get('/assets/json/work-order-status-history.json').subscribe((results: any) => {
      // console.log(results);
      this.statusHistory = UtilitiesService.copyArrayToTypedArray(results.data, () => new WorkOrderNote());

    });

    http.get('/assets/json/notes.json').subscribe((results: any) => {
      this.notes = results.data;
    });

    http.get('/assets/json/work-order-detail.json').subscribe((results: any) => {
      const detail = UtilitiesService.copyObject(results.data[0], null, () => new WorkOrderSummary());
      console.log(detail);
      this.workOrderSummary = detail;
    });

    http.get('/assets/json/survey.json').subscribe((results: any) => {
      this.survey = results.data[0];
    });


    http.get('/assets/json/work-order-job-item-detail.json').subscribe((results: any) => {
      this.jobItems = UtilitiesService.copyArrayToTypedArray(results, () => new WorkOrderJobItem());
      console.log(this.jobItems);

      setTimeout(() => {
        for (const item of this.jobItems) {
          item.percent = (item.statusNumber / 5) * 100;
        }
      }, 100);
    });
  }

  ngOnInit(): void {
  }

  showCoverageAndNotes () {
    this.selectedIndex = 5;
  }

  get showScheduleAppointment() {
    return this.jobItems && this.jobItems.find(i => i.status === 'Transmitted');
  }

  get showComplete() {
    return this.jobItems && this.jobItems.find(i => i.status === 'Scheduled') && !this.showScheduleAppointment;
  }

  get showInvoicing() {
    return this.jobItems && this.jobItems.find(i => i.status === 'Complete') && !this.showComplete && !this.showScheduleAppointment;
  }

  async onStepChange() {
    window.location.hash = 'step' + this.selectedIndex.toString();

    // if (this.selectedIndex === 2 && !this.daysSchedule && this.workOrderSummary.scheduledDate) {
    //     this.serviceApi.getAssignedAppointmentsForDayNoAuth(this.workOrderSummary.scheduledDate, this.workOrderSummary.contractorId).then(today => {
    //         this.daysSchedule = today.sort((a, b) => a.appointmentStartHour < b.appointmentStartHour ? 1 : -1);

    //         this.setCurrentAppointment();
    //     });
    // }
    // if (this.selectedIndex === 5 && !this.contractorInvoices) {
    //     this.contractorInvoices = await this.serviceApi.getWorkOrderContractorInvoicesNoAuth(this.workOrderId);
    // }
  }

  updateStatusOnItem(item: WorkOrderJobItem) {
    this.dialog.open(EditJobItemsStatusComponent, { data: { workOrderSummary: this.workOrderSummary, allItems: this.jobItems, item } });
  }

  updateStatus() {
    const result = this.dialog.open(EditJobItemsStatusComponent, { data: { workOrderSummary: this.workOrderSummary, allItems: this.jobItems, item: null } });
    result.afterClosed().subscribe(results => {
      if (results) {

        this.addNewStatus(results.status, results.jobItems);
      }
    });
  }

  addNewStatus(status: string, jobItems: any[]) {
    let itemString = '';
    if (jobItems.length === this.jobItems.length) {
      itemString = 'All';
    } else {
      for (const item of jobItems) {
        if (itemString !== '') {
          itemString += ', ';
        }
        itemString += item.itemName;
      }

    }
    this.statusHistory.unshift({
      id: UtilitiesService.newid(),
      workOrderId: this.workOrderSummary.id,
      newStatus: status,
      createdDate: new Date(),
      items: itemString,
    });

  }

  setDate(date: DateSelection) {
    this.apptDate = date.date;
  }

  startInvoicing() {
    for (const item of this.jobItems) {
      item.selected = true;
    }
    this.selectedIndex = 3;
  }

  createAppointment() {
    for (const item of this.jobItems) {
      item.selected = true;
    }
    this.selectedIndex = 1;
  }

  completeWorkOrder() {
    this.selectedIndex = 0;

    setTimeout(() => {
      for (const item of this.jobItems) {
        if (item.selected) {
          item.status = 'Complete';
          item.statusNumber = 4;
          item.iconClass = 'check';
          item.percent = (item.statusNumber / 5) * 100;
        }
      }
    }, 500);
    this.addNewStatus('Complete', this.jobItems.filter(i => i.selected));
  }

  saveAppointment() {
    // this.savingAppointment = true;
    // this.serviceApi.setWorkOrderAppointmentDateNoAuth(this.workOrderId, this.apptDate, this.startWindow, this.endWindow).then(() => {
    //     this.back();
    //     this.refreshScreen();
    //     this.savingAppointment = false;
    // });
    this.selectedIndex = 0;

    setTimeout(() => {
      for (const item of this.jobItems) {
        if (item.selected) {
          item.status = 'Scheduled';
          item.statusNumber = 2;
          item.iconClass = 'today';
          item.percent = (item.statusNumber / 5) * 100;
        }
      }
    }, 500);
    this.addNewStatus('Scheduled', this.jobItems.filter(i => i.selected));
  }

  get canSaveAppointment() {
    if (!this.startWindow || !this.endWindow) {
      return false;
    }
    let startHour = parseInt(this.startWindow, 10);
    if (startHour < 12 && this.startWindow.indexOf('PM') > -1) {
      startHour += 12;
    }

    let endHour = parseInt(this.endWindow, 10);
    if (endHour < 12 && this.endWindow.indexOf('PM') > -1) {
      endHour += 12;
    }
    return this.apptDate && endHour > startHour;
  }

  saveInvoice() {
    this.selectedIndex = 0;

    setTimeout(() => {
      for (const item of this.jobItems) {
        if (item.selected) {
          item.status = 'Invoiced';
          item.statusNumber = 5;
          item.iconClass = 'monetization_on';
          item.percent = (item.statusNumber / 5) * 100;
        }
      }
    }, 500);
    this.addNewStatus('Invoiced', this.jobItems.filter(i => i.selected));
  }

  startComplete() {
    for (const item of this.jobItems) {
      item.selected = true;
    }
    this.selectedIndex = 2;
  }

  get canCompleteWorkOrder() {
    return this.resolution && this.completedDate && this.jobItems.find(i => i.selected);
  }


  back() {
    this.selectedIndex = 0;
  }

}

export class DateSelection {
  constructor(public date: Date, daysToAdd: number = 0) {
    date.setDate(date.getDate() + daysToAdd);
  }

  get dayOfWeek(): string {
    if (this.date.getDay() === 0) { return 'Sun'; }
    if (this.date.getDay() === 1) { return 'Mon'; }
    if (this.date.getDay() === 2) { return 'Tue'; }
    if (this.date.getDay() === 3) { return 'Wed'; }
    if (this.date.getDay() === 4) { return 'Thu'; }
    if (this.date.getDay() === 5) { return 'Fri'; }
    if (this.date.getDay() === 6) { return 'Sat'; }
  }

  get heading(): string {
    let result = '';
    if (this.date.getMonth() === 0) { result = 'Jan'; }
    if (this.date.getMonth() === 1) { result = 'Feb'; }
    if (this.date.getMonth() === 2) { result = 'Mar'; }
    if (this.date.getMonth() === 3) { result = 'Apr'; }
    if (this.date.getMonth() === 4) { result = 'May'; }
    if (this.date.getMonth() === 5) { result = 'Jun'; }
    if (this.date.getMonth() === 6) { result = 'Jul'; }
    if (this.date.getMonth() === 7) { result = 'Aug'; }
    if (this.date.getMonth() === 8) { result = 'Sep'; }
    if (this.date.getMonth() === 9) { result = 'Oct'; }
    if (this.date.getMonth() === 10) { result = 'Nov'; }
    if (this.date.getMonth() === 11) { result = 'Dec'; }

    result += ' ' + this.date.getDate();

    return result;
  }
}