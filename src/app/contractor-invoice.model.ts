export class ContractorInvoice {
    workOrderId: string;
    workPerformed: string;
    amount: number;
    partsCost: number;
    laborCost: number;
    tax: number;
    paidDate?: Date;
    receivedDate: Date;
    contractorInvoiceNumber: string;
    approvedDate?: Date;
    exportDate?: Date;
    quickBooksId: string;
    id: string;
    deletedDate?: Date;
    createdById?: string;
    lastModifiedById?: string;
    createdDate?: Date;
    lastModifiedDate?: Date;
    purchaseOrderId: string;

    // Client side only

    get totalAmount(): number {
        if (isNaN(this.partsCost)) {
            this.partsCost = 0;
        }
        if (isNaN(this.laborCost)) {
            this.laborCost = 0;
        }
        if (isNaN(this.tax)) {
            this.tax = 0;
        }
        return this.partsCost + this.laborCost + this.tax;
    }

    // get amount() {
    //     return this.partsCost + this.laborCost + this.tax;
    // }
    get canSave() {
        return this.contractorInvoiceNumber
            && this.workPerformed;
    }
}
