import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplianceAuthoComponent } from './appliance-autho/appliance-autho.component';
import { AuthoComponent } from './autho/autho.component';
import { CommunicationHubComponent } from './communication-hub/communication-hub.component';
import { ContractorPortalMaintComponent } from './contractor-portal-maint/contractor-portal-maint.component';
import { GearsTestComponent } from './gears-test/gears-test.component';
import { GraphTestComponent } from './graph-test/graph-test.component';
import { HomeComponent } from './home/home.component';
import { MaintServicesOrderComponent } from './maint-services-order/maint-services-order.component';
import { NewOrderFrameComponent } from './new-order-frame/new-order-frame.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RecordComponent } from './record/record.component';
import { SettingsComponent } from './settings/settings.component';
import { TestCustomerPortalComponent } from './test-customer-portal/test-customer-portal.component';
import { TestPageComponent } from './test-page/test-page.component';
import { TestRequestServiceComponent } from './test-request-service/test-request-service.component';
import { TimeSlotPickerComponent } from './time-slot-picker/time-slot-picker.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'test-real-estate-portal',
    component: TestPageComponent,
  },
  {
    path: 'test-customer-portal',
    component: TestCustomerPortalComponent,
  },
  {
    path: 'record',
    component: RecordComponent
  },
  {
    path: 'communication-hub',
    component: CommunicationHubComponent,
  },
  {
    path: 'view-subscription/:id',
    component: ViewPolicyComponent
  }, {
    path: 'new-order',
    component: NewOrderFrameComponent
  }, {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'appliance-autho',
    component: ApplianceAuthoComponent,
  },
  {
    path: 'flow-chart',
    component: GraphTestComponent,
  },
  {
    path: 'gears',
    component: GearsTestComponent,
  },
  {
    path: 'ratings',
    component: RatingsComponent
  }, {
    path: 'request-service',
    component: TestRequestServiceComponent,
  },
  {
    path: 'order',
    component: OrderPageComponent
  }, {
    path:'time-slots',
    component: TimeSlotPickerComponent,
  }, {
    path: 'scheduled-maintenance',
    component: MaintServicesOrderComponent
  },
  {
    path: 'contractor-portal-maint',
    component: ContractorPortalMaintComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
