// "itemName": "Cooktop",
// "url": "https://api.elevatehw.com/api/WorkOrderItem/8439385f-75b1-492b-b3ce-be9d88cb9914/Photo",
// "status": "Invoiced",
// "statusNumber": 5,
// "iconClass": "today"

export class WorkOrderJobItem {
    itemName: string;
    url: string;
    status: string;
    statusNumber: number;
    iconClass: string;
    percent = 0;
    id: string;
    qandA: string;
    private parsedQAndA: any;

    // get percent() {
    //     return (this.statusNumber / 5 * 100);
    // }

    
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