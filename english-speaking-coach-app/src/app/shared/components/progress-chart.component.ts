import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  template: `
    <mat-card class="progress-chart-card">
      <mat-card-header>
        <mat-card-title class="text-lg font-semibold">{{ title }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content class="mt-4">
        <div class="chart-container" style="position: relative; height: 300px;">
          <canvas 
            baseChart
            [type]="chartType"
            [data]="chartData"
            [options]="chartOptions">
          </canvas>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .progress-chart-card {
      height: 100%;
    }

    .chart-container {
      position: relative;
      height: 300px;
    }
  `]
})
export class ProgressChartComponent implements OnInit {
  @Input() title: string = 'Progress Chart';
  @Input() data!: ChartData;
  @Input() chartType: 'line' | 'bar' = 'line';
  
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  ngOnInit(): void {
    if (this.data) {
      this.chartData = {
        labels: this.data.labels,
        datasets: this.data.datasets.map(dataset => ({
          ...dataset,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }))
      };
    }
  }
}
