import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autho',
  templateUrl: './autho.component.html',
  styleUrls: ['./autho.component.css']
})
export class AuthoComponent implements OnInit {

  index = 0;
  repairItems: any[];
  groupedRepairItems: any[] = [];

  steps = [
    'Coverage Item Determination',
    'Problem Determination',
    'Cause Of Problem',
    'Timing',
    'Manufacturers Warranty',
    'Remedy',
    'Repair Items',
    'Approval'
  ];

  types = [
    'Compressor',
    'Air Handler',
    'Package Unit',
    'Window Unit',
    'Portable Unit'
  ];

  reasonsForReplace = [
    'Beyond useful life and in poor condition',
    'Cost to repair is not prudent',
    'Unable to get parts',
    'Repair History'
  ];
  selectedReasonForReplace: string;

  selectedType: string;
  predate: boolean = null;
  mfWarranty: string = null;
  repairReplace: string = null;
  repairToday: boolean = null;

  locations = [
    'Attic',
    'Mechanical Room',
    'Outdoor',
  ];
  selectedLocation: string;

  problems = [
    'Not Cooling',
    'Condensor Line Clog',

  ];
  selectedProblem: string;

  causes = [
    { name: 'Normal Wear & Tear', coveredType: 'Covered' },
    { name: 'Act of Nature', coveredType: 'NotCovered' },
    { name: 'Improper Usage', coveredType: 'NotCovered' },
    { name: 'Neglect or Lack of Maintenance', coveredType: 'PossibleCovered' },
    { name: 'Improper Previous Repairs or Installation', coveredType: 'PossibleCovered' },
    { name: 'Consequential or Secondary Damage', coveredType: 'PossibleCovered' },
    { name: 'Pet Damage or Abuse', coveredType: 'PossibleCovered' },
  ];

  selectedCause: any;
  repairItemAttributes: any[];
  repairItemAttributeValues: any[];
  selectedRepairItems: any[];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/assets/json/repair-items.json').subscribe((results: any) => {
      console.log(results);
      this.repairItems = results.filter(i => i.repairItemGroupId === 'deb353c1-147a-436a-8e6d-a05a5b30ed5f');
      console.log(this.repairItems);

      for (const item of this.repairItems) {
        let groupedItem = this.groupedRepairItems.find(i => i.name === item.groupName);
        if (!groupedItem) {
          groupedItem = {
            name: item.groupName,
            items: []
          };

          this.groupedRepairItems.push(groupedItem);
        }
        groupedItem.items.push(item);
      }
    });
    this.http.get('/assets/json/repair-item-attribute.json').subscribe((results: any) => {
      console.log(results);
      this.repairItemAttributes = results;
    });
    this.http.get('/assets/json/repair-item-attribute-value.json').subscribe((results: any) => {
      console.log(results);
      this.repairItemAttributeValues = results;
    });
  }

  // get selectedRepairItems() {
  //   if (!this.repairItems) {
  //     return null;
  //   }
  //   return this.repairItems.filter(i => i.selected);
  // }

  get currentStep() {
    return this.steps[this.index];
  }

  get nextStep() {
    return this.steps[this.index + 1];
  }

  get pct() {
    return ((this.index + 1) / this.steps.length) * 100;
  }

  get canGoNext() {
    return true;
  }

  next() {
    this.index++;
    if (this.index === 2) {
      this.selectedRepairItems = this.repairItems.filter(i => i.selected);
      for (const item of this.selectedRepairItems) {
        item.attributes = this.repairItemAttributes.filter(i => i.repairItemId === item.id);
        item.attributes = item.attributes.sort((a, b) => a.sort > b.sort ? 1 : -1);
        for (const attribute of item.attributes) {
          attribute.values = this.repairItemAttributeValues.filter(i => i.repairItemAttributeId === attribute.id);
          attribute.values = attribute.values.sort((a, b) => a.sort > b.sort ? 1 : -1);
        }
      }
      console.log(this.selectedRepairItems);
    }
  }


  back() {
    this.index--;
  }

}
