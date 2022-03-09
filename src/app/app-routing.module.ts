import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplianceAuthoComponent } from './appliance-autho/appliance-autho.component';
import { AuthoComponent } from './autho/autho.component';
import { CommunicationHubComponent } from './communication-hub/communication-hub.component';
import { GearsTestComponent } from './gears-test/gears-test.component';
import { HomeComponent } from './home/home.component';
import { NewOrderFrameComponent } from './new-order-frame/new-order-frame.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RecordComponent } from './record/record.component';
import { SettingsComponent } from './settings/settings.component';
import { TestCustomerPortalComponent } from './test-customer-portal/test-customer-portal.component';
import { TestPageComponent } from './test-page/test-page.component';
import { TestRequestServiceComponent } from './test-request-service/test-request-service.component';
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
    path: 'gears',
    component: GearsTestComponent,
  },
  {
    path: 'ratings',
    component: RatingsComponent
  }, {
    path: 'request-service',
    component: TestRequestServiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
