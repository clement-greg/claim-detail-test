import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maint-services-order',
  templateUrl: './maint-services-order.component.html',
  styleUrls: ['./maint-services-order.component.css']
})
export class MaintServicesOrderComponent implements OnInit {


  services: any[];
  packages: any[];
  landscapeFlipped = false;
  selectedIndex = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`/assets/json/maintenance-services.json`).subscribe((results: any) => {
      console.log(results);

      this.services = results;
    });

    this.http.get(`/assets/json/lawn-packages.json`).subscribe((results: any) => {
      console.log(results);

      this.packages = results;
    });

  }


}
