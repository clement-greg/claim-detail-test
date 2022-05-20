import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilitiesService } from '../utilities';

@Component({
  selector: 'app-time-slot-picker',
  templateUrl: './time-slot-picker.component.html',
  styleUrls: ['./time-slot-picker.component.css']
})
export class TimeSlotPickerComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`/assets/json/policy-service-offering.json`).subscribe((results: any) => {
      console.log(results);

    });
  }



}
