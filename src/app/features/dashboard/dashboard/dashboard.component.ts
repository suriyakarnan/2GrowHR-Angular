import {
  Component, OnInit, AfterViewInit,
  OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string;
  iconColor: string;
}

export interface TodoItem {
  message: string;
  time?: string;
}

export interface HolidayItem {
  name: string;
  date: string;
  badgeLabel: string;
  badgeClass: string;
}

export interface AnniversaryItem {
  name: string;
  detail: string;
}

export interface BirthdayItem {
  name: string;
  date: string;
}

export interface LeaveItem {
  type: string;
  days: number;
  badgeClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('salaryChart') salaryChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  cards: StatCard[] = [
    { title: 'Attrition',  value: 0,       icon: 'ti-user-minus',    colorClass: 'card-teal',   iconColor: '#0F6E56' },
    { title: 'CTC',        value: 3761081,  icon: 'ti-building-bank', colorClass: '',            iconColor: '#185FA5' },
    { title: 'Taxes',      value: 0,        icon: 'ti-receipt-tax',   colorClass: '',            iconColor: '#EF9F27' },
    { title: 'Statutory',  value: 0,        icon: 'ti-building-bank', colorClass: 'card-pink',   iconColor: '#993556' },
    { title: 'Employees',  value: 94,       icon: 'ti-users',         colorClass: 'card-purple', iconColor: '#534AB7' },
    { title: 'Attendance', value: 59,       icon: 'ti-calendar',      colorClass: 'card-pink',   iconColor: '#993556' },
  ];

  todoItems: TodoItem[] = [
    { message: 'You have 2 reimbursement claim pending.',             time: '15 June, 2026 02:01 PM' },
    { message: 'You have 64 Shifts to Customize.',                    time: '3 March, 2026 12:00AM'  },
    { message: 'You have 1 Loan Approval request to Approve/Reject.'                                  },
    { message: '1 Work From Home request to Approve/Reject.'                                          },
    { message: 'You have 3 On Duty request to Approve/Reject.'                                        },
  ];

  holidays: HolidayItem[] = [
    { name: 'Bakrid',           date: '7 June 2026',  badgeLabel: 'National', badgeClass: 'badge-green' },
    { name: 'Independence Day', date: '15 Aug 2026',  badgeLabel: 'National', badgeClass: 'badge-green' },
    { name: 'Diwali',           date: '20 Oct 2026',  badgeLabel: 'Optional', badgeClass: 'badge-amber' },
  ];

  anniversaries: AnniversaryItem[] = [
    { name: 'Thirumalaivasan', detail: '10 June (3 yrs)' },
    { name: 'Priya Rajan',     detail: '18 June (1 yr)'  },
    { name: 'Karthik M',       detail: '22 June (5 yrs)' },
  ];

  birthdays: BirthdayItem[] = [
    { name: 'Manikandan', date: '15 June' },
    { name: 'Sowmiya',    date: '19 June' },
    { name: 'Arjun S',    date: '28 June' },
  ];

  leaveItems: LeaveItem[] = [
    { type: 'Casual Leave', days: 8,  badgeClass: 'badge-blue'  },
    { type: 'Sick Leave',   days: 5,  badgeClass: 'badge-blue'  },
    { type: 'Earned Leave', days: 12, badgeClass: 'badge-amber' },
  ];

  selectedYear = 'Current Year';
  yearOptions  = ['Current Year', 'Last Year'];

  private chartLabels = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

  private chartData: Record<string, { gross: number[]; ctc: number[]; net: number[] }> = {
    'Current Year': {
      gross: [980000, 560000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ctc:   [900000, 520000, 50000, 10000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000],
      net:   [850000, 480000, 20000, 8000,  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000],
    },
    'Last Year': {
      gross: [700000, 720000, 680000, 750000, 710000, 690000, 730000, 760000, 700000, 720000, 680000, 740000],
      ctc:   [660000, 680000, 640000, 710000, 670000, 650000, 690000, 720000, 660000, 680000, 640000, 700000],
      net:   [600000, 620000, 580000, 650000, 610000, 590000, 630000, 660000, 600000, 620000, 580000, 640000],
    },
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.buildChart(this.selectedYear);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  onYearChange(year: string): void {
    this.selectedYear = year;
    this.buildChart(year);
  }

  private buildChart(year: string): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const data       = this.chartData[year];
    const isDark     = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    const labelColor = isDark ? '#aaa' : '#666';

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Gross',
            data: data.gross,
            backgroundColor: '#1D9E75',
            borderRadius: 3,
            order: 2,
          },
          {
            label: 'CTC',
            data: data.ctc,
            type: 'line',
            borderColor: '#1e3a5f',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            order: 1,
            tension: 0.1,
          } as any,
          {
            label: 'Net-Salary',
            data: data.net,
            type: 'line',
            borderColor: '#D85A30',
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 4],
            fill: false,
            order: 0,
            tension: 0.1,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 }, color: labelColor },
          },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { size: 10 } },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { size: 10 },
              callback: (value) => {
                const v = Number(value);
                return v >= 1000 ? '₹' + v / 1000 + 'K' : '₹' + v;
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(this.salaryChartRef.nativeElement, config);
  }
}