import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number | null;
  fullDate?: Date;
  status?: string;
  checkIn?: string;
  checkOut?: string;
}

interface TeamAttendanceDay {
  date: Date;
  status: string;
}

interface TeamMember {
  code: string;
  name: string;
  days: TeamAttendanceDay[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  employeeName: string = 'Beast';
  currentDateTime: Date = new Date();
  private clockInterval: any;

  shiftDetails = {
    code: 'MOR',
    startTime: '09:30:00',
    endTime: '18:00:00'
  };

  activeTab: 'my' | 'team' = 'my';
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarMonth: Date = new Date();
  calendarWeeks: CalendarDay[][] = [];

  // key format: 'YYYY-M-D'
  attendanceData: { [key: string]: { status: string; checkIn?: string; checkOut?: string } } = {
    '2026-7-1': { status: 'present', checkIn: '9:00 AM', checkOut: '6:00 PM' },
    '2026-7-2': { status: 'absent' },
    '2026-7-3': { status: 'holiday' },
    '2026-7-4': { status: 'weekoff', checkOut: '6:00 PM' },
    '2026-7-5': { status: 'absent' },
    '2026-7-6': { status: 'absent' },
    '2026-7-7': { status: 'absent' },
    '2026-7-8': { status: 'absent' },
    '2026-7-9': { status: 'absent' }
  };

  legend = [
    { label: 'Holiday', class: 'legend-holiday' },
    { label: 'Absent', class: 'legend-absent' },
    { label: 'Leave', class: 'legend-leave' },
    { label: 'Week-Off', class: 'legend-weekoff' },
    { label: 'On Regularization', class: 'legend-regularization' },
    { label: 'Work From Home', class: 'legend-wfh' },
    { label: 'OD', class: 'legend-od' },
    { label: 'Unpaid Leave', class: 'legend-unpaid' }
  ];

  teamWeekStart: Date = new Date();
  teamAttendance: TeamMember[] = [];

  anniversaries = [
    { name: 'Seetha lakshmi', date: '19 July', years: 7 },
    { name: 'Nesanth T', date: '4 November', years: 7 },
    { name: 'Yamuna', date: '5 November', years: 7 }
  ];

  birthdays = [
    { name: 'Nesanth T', date: '16 July' }
  ];

  leaveList: any[] = [];

  leaveBalances = [
    { label: 'paidleave', value: 13.5, max: 18, color: '#17c3a2', labelClass: 'lb-green' },
    { label: 'vacation_off', value: 5, max: 10, color: '#2f9ee0', labelClass: 'lb-blue' },
    { label: 'LEAVE RESET BIWEEKLY CARRY FORWARD PERCENTAGE ACCURAL WEEKLY', value: 1.59, max: 1.8, color: '#e64a8c', labelClass: 'lb-pink' }
  ];


  requests: any[] = [];
  probationList: any[] = [];
  holidaysList: any[] = [];

  ngOnInit(): void {
    this.calendarMonth = new Date(2026, 6, 1); // July 2026 (0-indexed month)
    this.generateCalendar();

    this.teamWeekStart = this.getWeekStart(new Date(2026, 6, 5));
    this.generateTeamAttendance();

    this.clockInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  switchTab(tab: 'my' | 'team'): void {
    this.activeTab = tab;
  }

  get monthLabel(): string {
    return this.calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  prevMonth(): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startWeekday; i++) {
      days.push({ date: null });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const key = `${year}-${month + 1}-${d}`;
      const info = this.attendanceData[key];
      days.push({
        date: d,
        fullDate: new Date(year, month, d),
        status: info?.status,
        checkIn: info?.checkIn,
        checkOut: info?.checkOut
      });
    }

    while (days.length % 7 !== 0) {
      days.push({ date: null });
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    this.calendarWeeks = weeks;
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  }

  get teamWeekLabel(): string {
    const end = new Date(this.teamWeekStart);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    return `${fmt(this.teamWeekStart)} - ${fmt(end)}`;
  }

  get teamWeekDays(): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.teamWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }

  prevWeek(): void {
    const d = new Date(this.teamWeekStart);
    d.setDate(d.getDate() - 7);
    this.teamWeekStart = d;
    this.generateTeamAttendance();
  }

  nextWeek(): void {
    const d = new Date(this.teamWeekStart);
    d.setDate(d.getDate() + 7);
    this.teamWeekStart = d;
    this.generateTeamAttendance();
  }

  private generateTeamAttendance(): void {
    const absentDates = ['2026-7-5', '2026-7-6', '2026-7-7', '2026-7-8', '2026-7-9'];
    const days: TeamAttendanceDay[] = this.teamWeekDays.map(d => {
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      return { date: d, status: absentDates.includes(key) ? 'absent' : '' };
    });

    this.teamAttendance = [
      { code: 'QW/QA/AUT/xx028', name: 'Suriya', days }
    ];
  }

  statusClass(status?: string): string {
    return status ? 'status-' + status : '';
  }

    private readonly circleRadius = 46;
  get circleCircumference(): number {
    return 2 * Math.PI * this.circleRadius;
  }

  getDashOffset(value: number, max: number): number {
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    return this.circleCircumference * (1 - pct);
  }
}