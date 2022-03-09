import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


export class AppliancePart {
  partNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  companyProvides: boolean;
  imageUrl: string;
  editMode: boolean;
  manufacturer: string;
  manufacturerCode: string;
  modelNumber: number;

  get subtotal() {
    return this.unitPrice * this.quantity;
  }
}

export class ApplianceApiPart {
  available: boolean;
  description: string;
  imageUrl: string;
  inStock: boolean;
  manufacturer: string;
  manufacturerCode: string;
  name: string;
  productNumber: string;
  price: number;
  quantity: number;
  retailPrice: number;
  selected: boolean;
}

export class ApplianceApiModel {
  applianceType: string;
  manufacturer: string;
  modelNumber: string;
  partCategories: AppliancePartCategory[];
}

export class AppliancePartCategory {
  diagramUrl: string;
  name: string;
  parts: ApplianceApiPart[];
}

// export class AppliancePartCategoryPart {
//   alternateProductNumber: string;
//   description: string;
//   diagramReferenceNumber: string;
//   productNumber: string;
//   replacementMfc: string;
//   replacementPart: string;
// }

@Component({
  selector: 'app-appliance-autho',
  templateUrl: './appliance-autho.component.html',
  styleUrls: ['./appliance-autho.component.css']
})
export class ApplianceAuthoComponent implements OnInit {

  applianceParts: AppliancePart[];
  // partOrModel: string = 'GTS18GTHMRWW';
  // partOrModel: string = 'SMG  DA97-15217D';

  partOrModel: string;
  searching = false;
  selectedIndex = 0;
  selectedPart: ApplianceApiPart;
  selectedModel: ApplianceApiModel;
  noMatch = false;
  selectedPartCategory: AppliancePartCategory;
  quantities = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];
  manufacturers = [
    'Whirlpool',
    'GE',
    'Frigidaire',
    'Other'
  ];
  viewDiagram = false;
  newPart = new AppliancePart();


  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.applianceParts = [];
    this.newPart.quantity = 1;
  }

  get canSearch() {
    return this.partOrModel && !this.searching;
  }

  addCustom() {
    this.selectedIndex = 3;
    this.noMatch = false;
  }

  selectedIndexChange() {
    this.noMatch = false;
    this.partOrModel = '';
  }

  cancelEvent(evt: MouseEvent) {
    evt.cancelBubble = true;

  }

  showCategory(partCategory: AppliancePartCategory) {
    console.log(partCategory);
    this.selectedPartCategory = partCategory;
  }

  toggleSelectedPart(part: ApplianceApiPart) {
    part.selected = !part.selected;
  }

  addSinglePartToRepair() {
    const appliancePart = new AppliancePart();
    appliancePart.companyProvides = true;
    appliancePart.description = this.selectedPart.description;
    appliancePart.imageUrl = this.selectedPart.imageUrl;
    appliancePart.partNumber = this.selectedPart.productNumber;
    appliancePart.quantity = 1;
    appliancePart.unitPrice = this.selectedPart.price;
    appliancePart.manufacturer = this.selectedPart.manufacturer;
    appliancePart.manufacturerCode = this.selectedPart.manufacturerCode;
    this.applianceParts.push(appliancePart);
    this.selectedIndex = 0;
    this.snackbar.open('Part added', null, { duration: 5000 });
  }

  get partsSelected() {
    if (!this.selectedModel) {
      return false;
    }

    for (const cat of this.selectedModel.partCategories) {
      for (const item of cat.parts) {
        if (item.selected) {
          return true;
        }
      }
    }

    return false;
  }

  get canAddNew() {
    return this.newPart.manufacturer && this.newPart.partNumber && this.newPart.description;
  }

  addNewToRepair() {
    const appliancePart = new AppliancePart();
    appliancePart.companyProvides = false;
    appliancePart.description = this.newPart.description;
    appliancePart.manufacturer = this.newPart.manufacturer;
    appliancePart.partNumber = this.newPart.partNumber;
    appliancePart.quantity = this.newPart.quantity;
    appliancePart.unitPrice = this.newPart.unitPrice;
    this.applianceParts.push(appliancePart);

    this.newPart = new AppliancePart();
    this.newPart.quantity = 1;
    this.selectedIndex = 0;
    this.snackbar.open('Part added', null, { duration: 5000 });
  }

  addItemsToRepair() {
    for (const cat of this.selectedModel.partCategories) {
      for (const item of cat.parts) {
        if (item.selected) {
          const appliancePart = new AppliancePart();
          appliancePart.description = item.description;
          appliancePart.imageUrl = item.imageUrl;
          appliancePart.partNumber = item.productNumber;
          appliancePart.quantity = item.quantity;
          appliancePart.unitPrice = item.price;
          appliancePart.companyProvides = true;
          appliancePart.manufacturer = item.manufacturer;
          appliancePart.manufacturerCode = item.manufacturerCode;
          this.applianceParts.push(appliancePart);
        }
      }
    }
    this.selectedIndex = 0;
    this.snackbar.open('Parts added', null, { duration: 5000 });
  }

  get orderTotal() {
    if (!this.applianceParts || this.applianceParts.length === 0) {
      return 0;
    }

    return this.applianceParts.map(i => i.unitPrice * i.quantity).reduce((a, b) => a + b);
  }

  deletePart(part: AppliancePart) {
    const index = this.applianceParts.indexOf(part);
    this.applianceParts.splice(index, 1);
    const ref = this.snackbar.open('Part Deleted', 'Undo', { duration: 7000 });
    ref.onAction().subscribe(() => {
      this.applianceParts.splice(index, 0, part);
    });
  }

  async search() {
    this.noMatch = false;
    const modelDetail: ApplianceApiModel = (await this.http.get('/assets/json/model-detail.json').toPromise() as any);
    const partDetail: ApplianceApiPart = (await this.http.get('/assets/json/part-detail.json').toPromise() as any);

    console.log(modelDetail);
    console.log(partDetail);

    for (const cat of modelDetail.partCategories) {
      for (const item of cat.parts) {
        item.quantity = 1;
      }
    }
    if (this.partOrModel.toLocaleLowerCase() === modelDetail.modelNumber.toLowerCase()) {
      this.selectedModel = modelDetail;
      this.selectedIndex = 1;
    } else if (this.partOrModel.toLowerCase() === partDetail.productNumber.toLowerCase()) {
      this.selectedPart = partDetail;
      this.selectedIndex = 2;
    } else {
      this.noMatch = true;
    }
  }
}
