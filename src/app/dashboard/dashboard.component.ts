import { Component, OnInit } from '@angular/core';
declare var Utils: any;
declare var Chart: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.doChart();

  }

  private doChart() {
    if (!document.getElementById('myChart')) {
      setTimeout(() => this.doChart(), 100);
      return;
    }

    var ctx = (document.getElementById("myChart") as any).getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, 'rgba(24,218,213,.01)');
    gradient.addColorStop(1, 'rgba(24,218,213,.1)');

    const DATA_COUNT = 7;
    const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [4, 6, 16, 14, 8, 11, 7, 20, 21, 11, 13, 5],
          fill: true,
          backgroundColor: gradient, // Put the gradient here as a fill color
          borderColor: 'rgba(24,218,213,1)',
          lineTension: 0,

        },
      ]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        datasetStrokeWidth: 3,
        pointDotStrokeWidth: 4,
        color: '#fff',
        elements: {
          point : {
            radius: 0
          }
        },
        scales: {
          xAxes: {
            grid: {
              color: 'transparent'
            }
          },
          yAxes: {
            grid: {
              color: 'rgba(255,255,255, .1)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: false,
            text: 'Chart.js Line Chart'
          }
        }
      },
    };


    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
    var ctxShadow = (document.getElementById("myChartShadow") as any).getContext("2d");
    var dataShadow = JSON.parse(JSON.stringify(data));
    // dataShadow.datasets[0].borderColor = "rgba(220,220,220,0.2)"
    dataShadow.datasets[0].fill = false;
    new Chart(
      document.getElementById('myChartShadow'),
      {
        type: 'line',
        data: dataShadow,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          elements: {
            point : {
              radius: 0
            }
          },
          scales: {
            xAxes: {
              ticks: {
                display: true,
              },
              grid: {
                color: 'transparent'
              }
            },
            yAxes: {
              ticks: {
                display: true,
              },
              grid: {
                color: 'transparent'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              display: false,
            },
            title: {
              display: false,
              text: 'Chart.js Line Chart'
            }
          }
        }
      }
    );


  }

}
