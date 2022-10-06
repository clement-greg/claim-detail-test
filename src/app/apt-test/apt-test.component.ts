import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apt-test',
  templateUrl: './apt-test.component.html',
  styleUrls: ['./apt-test.component.css']
})
export class AptTestComponent implements OnInit {

  baseUrl = 'https://test.encompass.com';

  constructor(private http: HttpClient,) { }

  ngOnInit(): void {

  }

  doPartSearch() {
    const args = {
      settings: {
        jsonUser: '',
        jsonPassword: '',
      },
      data: {
        searchTerm: '',
        mode: '',
        limtBrand: 'SON'
      }
    }
  }

  async getBrandList() {
    const args = {
      settings: {
        jsonUser: 'ELEVATE',
        jsonPassword: 'K23FV6XSDH4F4HJ1',
      },
    }

    const url = `${this.baseUrl}/restfullservice/brandlist`;


    const result = await this.http.post(url,args).toPromise();
    console.log(result);
  }

}
