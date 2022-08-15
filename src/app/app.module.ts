import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatNativeDateModule } from '@angular/material/core';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { ClaimSummaryComponent } from './claim-summary/claim-summary.component';
import { CircleWidgetSmallComponent } from './circle-widget-small/circle-widget-small.component';
import { EditJobItemsStatusComponent } from './edit-job-items-status/edit-job-items-status.component';
import { DisplayTotalComponent } from './display-total/display-total.component';
import { TestPageComponent } from './test-page/test-page.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { NewOrderFrameComponent } from './new-order-frame/new-order-frame.component';
import { SettingsComponent } from './settings/settings.component';
import { RatingsComponent } from './ratings/ratings.component';
import { AuthoComponent } from './autho/autho.component';
import { SwapableImageComponent } from './swapable-image/swapable-image.component';
import { RecordComponent } from './record/record.component';
import { TestCustomerPortalComponent } from './test-customer-portal/test-customer-portal.component';
import { TestRequestServiceComponent } from './test-request-service/test-request-service.component';
import { ItemSelectionComponent } from './item-selection/item-selection.component';
import { ServiceRequestSummaryComponent } from './service-request-summary/service-request-summary.component';
import { QuestionWizardComponent } from './question-wizard/question-wizard.component';
import { PaymentMethodEntryComponent } from './payment-method-entry/payment-method-entry.component';
import { HomeComponent } from './home/home.component';
import { CommunicationHubComponent } from './communication-hub/communication-hub.component';
import { ApplianceAuthoComponent } from './appliance-autho/appliance-autho.component';
import { GearsTestComponent } from './gears-test/gears-test.component';
import { GraphTestComponent } from './graph-test/graph-test.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { OrderPageComponent } from './order-page/order-page.component';
import { SpecialCurrencyPipe } from './pipes/special-currency.pipe';
import { TimeSlotPickerComponent } from './time-slot-picker/time-slot-picker.component';
import { MaintServicesOrderComponent } from './maint-services-order/maint-services-order.component';
import { ContractorPortalMaintComponent } from './contractor-portal-maint/contractor-portal-maint.component';
import { CompleteAppointmentDialogComponent } from './complete-appointment-dialog/complete-appointment-dialog.component';
import { CheckCircleAnimatedComponent } from './check-circle-animated/check-circle-animated.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkOrderDetailComponent,
    ClaimSummaryComponent,
    CircleWidgetSmallComponent,
    EditJobItemsStatusComponent,
    DisplayTotalComponent,
    TestPageComponent,
    DoughnutComponent,
    ViewPolicyComponent,
    NewOrderFrameComponent,
    SettingsComponent,
    RatingsComponent,
    AuthoComponent,
    SwapableImageComponent,
    RecordComponent,
    TestCustomerPortalComponent,
    TestRequestServiceComponent,
    ItemSelectionComponent,
    ServiceRequestSummaryComponent,
    QuestionWizardComponent,
    PaymentMethodEntryComponent,
    HomeComponent,
    CommunicationHubComponent,
    ApplianceAuthoComponent,
    GearsTestComponent,
    GraphTestComponent,
    OrderPageComponent,
    SpecialCurrencyPipe,
    TimeSlotPickerComponent,
    MaintServicesOrderComponent,
    ContractorPortalMaintComponent,
    CompleteAppointmentDialogComponent,
    CheckCircleAnimatedComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTreeModule,
    MatNativeDateModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
