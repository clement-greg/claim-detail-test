import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthoComponent } from './autho/autho.component';
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
    path: 'view-subscription/:id',
    component: ViewPolicyComponent
  }, {
    path: 'new-order',
    component: NewOrderFrameComponent
  }, {
    path: 'settings',
    component: SettingsComponent,
  }, {
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
