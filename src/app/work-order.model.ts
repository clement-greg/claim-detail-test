import { DatePipe } from "@angular/common";
import { UtilitiesService } from "./utilities";

export class WorkOrderSummary {
    id: string;
    number: number;
    qandA: string;
    itemName: string;
    propertyAddress: string;
    propertyCity: string;
    propertyState: string;
    propertyPostalCode: string;
    propertyId: string;
    homeownerName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    contactMobile: string;
    contractorEmail: string;
    additionalNotes: string;
    contractorName: string;
    contractorPhone: string;
    policyId: string;
    contractorId: string;
    dateClosed?: Date;
    status: string;
    createdDate?: Date;
    authorizationLimit: number;
    itemId: string;
    type: string;
    scheduledDate?: Date;
    scheduledStartWindow: string;
    scheduledEndWindow: string;
    dateCompleted?: Date;
    dispatchedDate?: Date;
    sentDate?: Date;
    holderId?: string;
    // planItemId?: string;
    cancelledDate?: Date;
    tradeId: string;
    claimId: string;
    sendEmail: string;
    tradeName: string;
    createdById?: string;
    createdByName: string;
    policyAddressId: string;
    policyNumber: number;
    totalCashOuts: number;
    totalContractorInvoices: number;
    totalPurchaseOrders: number;
    workPerformed: string;
    regionId?: string;
    stateId?: string;
    sLAStatus: string;
    statusDate?: Date;
    formattedAppointmentDate: string;
    homeownerEmail: string;
    createdByEmail: string;
    marketAreaName: string;
    marketStateName: string;
    workOrderStatusId: string;
    contractorPreferredContactMethod: string;
    itemPriority: number;
    technicianId: string;
    assignedToName: string;
    assignedToUserId: string;
    canRecall: boolean;
    redDisplayColor: string;
    effectiveDate: Date;
    expirationDate: Date;
    propertyAddress2: string;
    homeownerMobileNumber: string;
    homeownerHomeNumber: string;
    private parsedQAndA: any;


    private datePipe: DatePipe = new DatePipe('en-US');

    overlapCount: number;

    get effectiveDescription() {
        if (!this.effectiveDate) {
            return null;
        }

        return `${this.datePipe.transform(this.effectiveDate, 'MM/dd/yyyy')} - ${this.datePipe.transform(this.expirationDate, 'MM/dd/yyyy')}`;
    }

    get appointmentDescription(): string {
        if (!this.scheduledDate) { return null; }

        return this.datePipe.transform(this.scheduledDate, 'MM/dd/yyyy') + ' '
            + this.scheduledStartWindow + ' - ' + this.scheduledEndWindow;
    }

    get completedDescription(): string {
        if (!this.dateCompleted) { return null; }

        return this.datePipe.transform(this.dateCompleted, 'MM/dd/yyyy');
    }

    get dispatchDescription(): string {
        if (!this.dispatchedDate) { return null; }

        return this.datePipe.transform(this.dispatchedDate, 'MM/dd/yyyy');
    }

    get sentDescription(): string {
        if (!this.sentDate) { return null; }

        return this.datePipe.transform(this.sentDate, 'MM/dd/yyyy');
    }


    get questionsAndAnswers(): any {
        if (!this.qandA) {
            return null;
        }
        if(!this.parsedQAndA) {
            this.parsedQAndA = JSON.parse(this.qandA);

        }
        return this.parsedQAndA;
    }

    get canCancel() {
        if (this.cancelledDate) {
            return false;
        }

        if (this.dateCompleted) {
            return false;
        }

        if (this.formattedAppointmentDate) {
            const appDate = new Date(this.formattedAppointmentDate);
            if (appDate < new Date() || UtilitiesService.datesEqual(appDate, new Date())) {
                return false;
            }
        }

        return true;
    }

    get appointmentStartHour() {
        if (!this.scheduledStartWindow) {
            return null;
        }

        let hour = parseInt(this.scheduledStartWindow, 10);
        if (hour !== 12 && this.scheduledStartWindow.toUpperCase().indexOf('PM') > -1) {
            hour += 12;
        }

        return hour;
    }

    get appointmentEndHour() {
        if (!this.scheduledEndWindow) {
            return null;
        }

        let hour = parseInt(this.scheduledEndWindow, 10);
        if (hour !== 12 && this.scheduledEndWindow.toUpperCase().indexOf('PM') > -1) {
            hour += 12;
        }

        return hour;
    }

    private timeInStatusPrivate: string;

    get timeInStatus() {
        if (!this.timeInStatusPrivate) {
            if (!this.statusDate) {
                return null;
            }

            let diff = ((new Date()).getTime() - this.statusDate.getTime()) / 1000;

            let days = 0;
            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            if (diff >= 86400) {

                days = Math.floor(diff / 86400);
                diff -= days * 86400;
            }
            if (diff >= 3600) {
                hours = Math.floor(diff / 3600);
                diff -= hours * 3600;
            }

            if (diff >= 60) {
                minutes = Math.floor(diff / 60);
                diff -= minutes * 60;
            }


            seconds = Math.floor(diff);

            let result = '';

            if (days > 0) {
                result += days + (days > 1 ? ' days ' : ' day ');
            }

            if (hours > 0) {
                result += hours + (hours > 1 ? ' hours ' : ' hour ');
            }

            if (minutes > 0) {
                result += minutes + (minutes > 1 ? ' minutes ' : ' minute ');
            }
            this.timeInStatusPrivate = result.trim();
            if (!this.timeInStatusPrivate) {
                this.timeInStatusPrivate = '0 minutes';
            }
        }

        // if (seconds > 0) {
        //     result += seconds + (seconds > 1 ? ' seconds ' : ' second ');
        // }

        return this.timeInStatusPrivate;
    }
}

export class WorkOrderJobItem {
    id: string;
    workOrderId: string;
    itemName: string;
    itemId: string;
    qandA: string;
    parsedQAndA: any;
    status: string;

    get questionsAndAnswers(): any {
        if (!this.qandA) {
            return null;
        }
        if(!this.parsedQAndA) {
            this.parsedQAndA = JSON.parse(this.qandA);

        }
        return this.parsedQAndA;
    }
}