import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplianceAuthoTwoComponent } from './appliance-autho-two/appliance-autho-two.component';
import { ApplianceAuthoComponent } from './appliance-autho/appliance-autho.component';
import { AptTestComponent } from './apt-test/apt-test.component';
import { AuthoComponent } from './autho/autho.component';
import { CirclesLoginComponent } from './circles-login/circles-login.component';
import { CommunicationHubComponent } from './communication-hub/communication-hub.component';
import { ContainerTestComponent } from './container-test/container-test.component';
import { ContractorPortalMaintComponent } from './contractor-portal-maint/contractor-portal-maint.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailTestComponent } from './email-test/email-test.component';
import { GearsTestComponent } from './gears-test/gears-test.component';
import { GraphTestComponent } from './graph-test/graph-test.component';
import { HomeComponent } from './home/home.component';
import { MaintServicesOrderComponent } from './maint-services-order/maint-services-order.component';
import { NewOrderFrameComponent } from './new-order-frame/new-order-frame.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RecordComponent } from './record/record.component';
import { SettingsComponent } from './settings/settings.component';
import { TestCameraComponent } from './test-camera/test-camera.component';
import { TestCustomerPortalComponent } from './test-customer-portal/test-customer-portal.component';
import { TestPageComponent } from './test-page/test-page.component';
import { TestRequestServiceComponent } from './test-request-service/test-request-service.component';
import { ThrobTestComponent } from './throb-test/throb-test.component';
import { TimeSlotPickerComponent } from './time-slot-picker/time-slot-picker.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { WallpaperComponent } from './wallpaper/wallpaper.component';
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
    path: 'appliance-autho-2',
    component: ApplianceAuthoTwoComponent,
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
  },
  {
    path: 'container',
    component: ContainerTestComponent,
  },
  {
    path: 'throb-test',
    component: ThrobTestComponent,
  },
  {
    path: 'parts-api',
    component: AptTestComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'email-test',
    component: EmailTestComponent,
  },
  {
    path: 'wallpaper',
    component: WallpaperComponent
  },
  {
    path: 'circle-login',
    component: CirclesLoginComponent,
  },
  {
    path:'test-camera',
    component: TestCameraComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
