import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @Input() pieChartId: any = '';
  @Input() PieChartData: any;
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    new Chart(this.pieChartId, {
      type: 'pie',
      data: {
        labels: this.PieChartData.labels,
        datasets: [
          {
            label: '',
            data: this.PieChartData.data,
            backgroundColor: this.PieChartData.colors,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
