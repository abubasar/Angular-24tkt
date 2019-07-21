import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {MatInputModule,MatFormFieldModule,MatDatepickerModule,MatIconModule,MatNativeDateModule } from '@angular/material';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpConfigInterceptor } from './httpconfig.interceptor';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CustomTypeaheadDirective } from './directives/custom-typeahead.directive';
import { SearchFeedComponent } from './components/search-feed/search-feed.component';
import { FlightComponent } from './components/flight/flight.component';
import { StateService } from './services/state.service';
import { MyTimePipe } from './pipes/my-time.pipe';
import { AppRoutingModule } from './app-routing.module';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    CustomTypeaheadDirective,
    SearchFeedComponent,
    FlightComponent,
    MyTimePipe,
    LoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatInputModule,MatFormFieldModule,MatDatepickerModule,MatIconModule,MatNativeDateModule,
    NgbModule,
    AngularMyDatePickerModule
  ],
  providers: [
    DatePipe,
    StateService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpConfigInterceptor,
      multi:true
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
