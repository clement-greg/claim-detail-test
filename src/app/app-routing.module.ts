import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthoComponent } from './autho/autho.component';
import { NewOrderFrameComponent } from './new-order-frame/new-order-frame.component';
import { RatingsComponent } from './ratings/ratings.component';
import { SettingsComponent } from './settings/settings.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AuthoComponent,
  },
  {
    path: 'test-real-estate-portal',
    component: TestPageComponent,
  }, {
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
