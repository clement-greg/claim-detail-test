import { Component, Input, SimpleChanges, Output, EventEmitter, ElementRef, HostListener, OnChanges, AfterViewInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../utilities';

export class WorkOrderItemModel {
  constructor(public id: string = null, public name: string = null, public category: string = null, public categorySort: number = null, public itemSort: number = null, public planItemId: string = null) {

  }

  get pictureUrl(): string {
      return 'https://dev-api.upkeeplabs.com/api/WorkOrderItem/' + this.id + '/Photo';
  }
}

export class GroupedWorkOrderItemModel {
  constructor(public category: string, public workOrderItems: WorkOrderItemModel[]) {


      this.summarizedWorkOrderItems = [];
      for (let i = 0; i < 4; i++) {
          if (workOrderItems[i]) {
              this.summarizedWorkOrderItems.push(workOrderItems[i]);
          }
      }

      this.hasMoreItems = workOrderItems.length > 4;
  }

  summarizedWorkOrderItems: WorkOrderItemModel[];
  hasMoreItems: boolean;



  get iconUrl(): string {
      return UtilitiesService.getCategoryUrl(this.category);
  }

  get sampleList() {
      return this.workOrderItems.map(i => i.name).join(',');
  }



  public static fromWorkOrderItems(workOrderItems: WorkOrderItemModel[]): GroupedWorkOrderItemModel[] {
      const results: GroupedWorkOrderItemModel[] = [];

      workOrderItems = workOrderItems.sort((a, b) => a.categorySort - b.categorySort);
      workOrderItems.forEach(workOrderItem => {
          let result = results.filter(i => i.category === workOrderItem.category)[0];
          if (!result) {
              result = new GroupedWorkOrderItemModel(workOrderItem.category,
                  workOrderItems.filter(i => i.category === workOrderItem.category).sort((a, b) => a.itemSort - b.itemSort));

              results.push(result);
          }
      });

      return results;
  }
}

@Component({
    templateUrl: './item-selection.component.html',
    styleUrls: ['./item-selection.component.css'],
    selector: 'item-selection'
})
export class ItemSelectionComponent implements OnChanges, AfterViewInit {

    constructor(private dialog: MatDialog) { }

    groupedItems: GroupedWorkOrderItemModel[];

    @Input() workOrderItems: WorkOrderItemModel[];
    @Input() hideHeader: boolean;

    filteredItems: WorkOrderItemModel[];

    filter = '';

    @Output() selectionChanged: EventEmitter<WorkOrderItemModel> = new EventEmitter<WorkOrderItemModel>();
    // selectedGroup: GroupedWorkOrderItemModel;
    selectedGroupIndex = 0;
    detailShown = false;

    selectedGroupItem: GroupedWorkOrderItemModel;

    ngAfterViewInit(): void {
        this.setupSwipe();
    }

    private setupSwipe() {
        if (document.getElementById('item-selection-container')) {
            UtilitiesService.swipeDetect(document.getElementById('item-selection-container'), (direction, evt) => {

                // let target = evt.target;
                // while (target != null) {
                //     if (target.id === 'grouped-items-container') {
                //         return;
                //     }

                //     target = target.parentElement;
                // }

                if (!this.detailShown) {
                    return;
                }
                let index = this.selectedGroupIndex;
                if (direction === 'left') {
                    // this.planIndex++;
                    index += 1;
                    if (index === this.groupedItems.length) {
                        index = 0;
                    }
                    if (this.groupedItems[index]) {
                        // this.selectedGroup = null;
                        // setTimeout(() => this.selectedGroup = this.groupedItems[index]);
                        this.selectedGroupIndex = index;
                    }
                }

                if (direction === 'right') {
                    index -= 1;
                    if (index === -1) {
                        index = this.groupedItems.length - 1;
                    }
                    if (this.groupedItems[index]) {
                        this.selectedGroupIndex = index;
                    }
                }
                if (direction === 'up') {
                    let target = evt.target;
                    while (target != null) {
                        if (target.id === 'tab-group') {
                            return;
                        }

                        target = target.parentElement;
                    }
                    this.detailShown = false;
                }
            });
        } else { setTimeout(() => this.setupSwipe(), 500); }
    }

    groupIndexChange(index) {
        if (!this.groupedItems) {
            return;
        }

        this.scrollTabIntoView(index);

    }

    private scrollTabIntoView(index) {
        const group = this.groupedItems[index];
        const headerElement = document.getElementById(`header_${group.category}`);
        if (headerElement) {

            headerElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

            // Not sure why this needed to be wrapped in a setTimeout, 
            setTimeout(() => {
                headerElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 200);
        }
    }

    groupSelected = false;
    setSelectedGroupItem(groupedItem) {
        this.groupSelected = false;
        if (this.selectedGroupItem === groupedItem) {
            this.selectedGroupItem = null;
        } else {
            this.selectedGroupItem = null;
            setTimeout(() => {
                this.selectedGroupItem = groupedItem;
                this.groupSelected = false;
                setTimeout(() => this.groupSelected = true);
            });
        }
    }


    setFilter(value) {
        this.filter = value;
        this.updateFilteredItems(value);
    }

    clearFilter() {
        this.filter = '';
        this.updateFilteredItems('');

    }

    updateFilteredItems(value) {
        if (!value) {
            this.filteredItems = this.workOrderItems;
            return;
        }
        this.filteredItems = this.workOrderItems.filter(i => {
            return i.name.toLowerCase().indexOf(value.toLowerCase()) > -1
                || i.category.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
    }

    selectGroup(group: GroupedWorkOrderItemModel) {
        // this.selectedGroup = null;
        // setTimeout(() => {
        //     this.selectedGroup = group;
        // });
        this.selectedGroupIndex = this.groupedItems.indexOf(group);
        this.detailShown = true;
        setTimeout(() => {
            this.scrollTabIntoView(this.selectedGroupIndex);
        }, 500);
    }

    get selectedGroup() {
        if (!this.groupedItems) {
            return null;
        }

        return this.groupedItems[this.selectedGroupIndex];
    }


    @HostListener('window:hashchange', ['$event'])
    watchUrlHash(event) {
        const hash = window.location.hash;

        if (hash !== '#ItemListSelection') {
            this.detailShown = false;
        }
    }

    setExpansion(item: GroupedWorkOrderItemModel, icon) {
        const nativeElement = icon._elementRef.nativeElement;
        this.animateTheIcon(nativeElement);
        setTimeout(() => (item as any).expanding = true, 10);
        setTimeout(() => {
            (item as any).expanding = false;
            window.location.hash = 'ItemListSelection';
            // this.selectedGroup = item;
        }, 400);

    }

    getItemUrl(item: WorkOrderItemModel) {
        return `https://dev-api.upkeeplabs.com/api/WorkOrderItem/${item.id}/photo`;
    }

    private cumulativeOffset(element) {
        let top = 0;
        let left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return { top, left };
    }

    private animateTheIcon(elementToCheck) {
        if (elementToCheck.classList && elementToCheck.classList.contains('category-icon')) {
            elementToCheck.classList.toggle('expanding');
            elementToCheck.style.position = 'fixed';
            elementToCheck.style.top = this.cumulativeOffset(elementToCheck).top + 'px';
            elementToCheck.style.left = '0%';
            setTimeout(() => {
                elementToCheck.classList.toggle('expanding');
                elementToCheck.style.top = '';
                elementToCheck.style.left = '';
                elementToCheck.style.position = 'absolute';
            }, 400);
        } else {
            elementToCheck.childNodes.forEach(item => this.animateTheIcon(item));
        }


    }

    selectWorkOrderItem(workOrderItem: WorkOrderItemModel) {
        this.selectionChanged.emit(workOrderItem);
        setTimeout(() => this.detailShown = false, 500);
    }

    showContractLanguage(item: WorkOrderItemModel) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.workOrderItems && changes.workOrderItems) {
            this.groupedItems = GroupedWorkOrderItemModel.fromWorkOrderItems(this.workOrderItems);


            if (this.groupedItems.length === 1) {
                this.detailShown = false;
                console.log('one group');
                this.setSelectedGroupItem(this.groupedItems[0]);
            }
        }
    }
}