import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-test',
  templateUrl: './container-test.component.html',
  styleUrls: ['./container-test.component.css']
})
export class ContainerTestComponent implements OnInit {

  width = 200;
  constructor() { }

  ngOnInit(): void {
  }

  get containerWidth() {
    return `${this.width}px`;
  }


}
