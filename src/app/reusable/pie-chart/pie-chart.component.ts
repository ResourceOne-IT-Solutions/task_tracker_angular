import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @Input() pieChartId: any = '';
  @Input() PieChartData: any;
  myPieChart: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.updateChart();
    }
  }
  ngOnInit() {}
  ngAfterViewInit() {
    this.myPieChart = new Chart(this.pieChartId, {
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
  private updateChart() {
    if (this.myPieChart) {
      this.myPieChart.data.labels = this.PieChartData?.labels;
      this.myPieChart.data.datasets[0].data = this.PieChartData?.data;
      this.myPieChart.data.datasets[0].backgroundColor =
        this.PieChartData?.colors;
      this.myPieChart.update();
    }
  }
  displayCenter(index: any) {
    if (
      this.PieChartData.data.length % 2 !== 0 &&
      index + 1 === this.PieChartData.data.length
    ) {
      return 'center';
    }
    return '';
  }
}
