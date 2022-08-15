import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-circle-animated',
  templateUrl: './check-circle-animated.component.html',
  styleUrls: ['./check-circle-animated.component.css']
})
export class CheckCircleAnimatedComponent implements OnInit {


  @Input() height = '200px';
  constructor() { }

  ngOnInit(): void {
  }

}
