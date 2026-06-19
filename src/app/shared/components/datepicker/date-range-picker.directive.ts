import {
  Directive, ElementRef, OnInit, OnDestroy, Renderer2,
} from '@angular/core';

@Directive({
  selector: 'input[dateRangePicker]',
  standalone: true,
})
export class DateRangePickerDirective implements OnInit, OnDestroy {

  private wrapper!: HTMLDivElement;
  private dropdown!: HTMLDivElement;
  private iconBtn!: HTMLButtonElement;
  private outsideClickListener!: () => void;

  private leftYear!: number;
  private leftMonth!: number;
  private rightYear!: number;
  private rightMonth!: number;

  private startDate: Date | null = null;
  private endDate: Date | null = null;
  private hoverDate: Date | null = null;
  private selecting: 'none' | 'start' = 'none';
  private isOpen = false;

  private readonly DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  private readonly SHORT_MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  private readonly PRESETS = [
    'Today', 'Yesterday', 'Last 7 Days',
    'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'
  ];

  private activePreset = 'Last 30 Days';

  // ✅ Cell map — avoids full DOM re-render on hover
  private cellMap: Map<string, { el: HTMLDivElement; date: Date }> = new Map();

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.rightYear  = now.getFullYear();
    this.rightMonth = now.getMonth();
    this.leftMonth  = this.rightMonth - 1;
    this.leftYear   = this.rightYear;
    if (this.leftMonth < 0) { this.leftMonth = 11; this.leftYear--; }

    this.applyPreset('Last 30 Days');
    this.buildUI();
    this.updateInput();
  }

  // ─────────────────────────────────────────────────────────────
  // BUILD UI
  // ─────────────────────────────────────────────────────────────

  private buildUI(): void {
    const input = this.el.nativeElement;

    this.wrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.wrapper, 'dp-wrapper');

    const inputRow: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(inputRow, 'dp-input-row');

    this.renderer.addClass(input, 'dp-input');
    this.renderer.setAttribute(input, 'readonly', 'true');
    this.renderer.setAttribute(input, 'placeholder', 'Select date range');

    this.iconBtn = this.renderer.createElement('button');
    this.renderer.addClass(this.iconBtn, 'dp-icon-btn');
    this.iconBtn.innerHTML = this.calendarSvg();
    this.iconBtn.type = 'button';

    this.dropdown = this.renderer.createElement('div');
    this.renderer.addClass(this.dropdown, 'dp-dropdown');
    this.renderer.addClass(this.dropdown, 'dp-range');

    // ✅ Safe DOM swap
    const parent = input.parentNode as HTMLElement;
    parent.replaceChild(this.wrapper, input);
    this.renderer.appendChild(inputRow, input);
    this.renderer.appendChild(inputRow, this.iconBtn);
    this.renderer.appendChild(this.wrapper, inputRow);
    this.renderer.appendChild(this.wrapper, this.dropdown);

    this.renderDropdown();

    this.iconBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    input.addEventListener('click', () => this.toggleDropdown());

    this.outsideClickListener = this.renderer.listen(
      'document', 'click', (e: MouseEvent) => {
        if (!this.wrapper.contains(e.target as Node)) this.closeDropdown();
      }
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER FULL DROPDOWN
  // ─────────────────────────────────────────────────────────────

  private renderDropdown(): void {
    this.dropdown.innerHTML = '';
    this.cellMap.clear();

    // ✅ Preset panel — always visible
    const presetPanel: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(presetPanel, 'dp-preset-panel');

    this.PRESETS.forEach(label => {
      const item: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(item, 'dp-preset-item');
      item.textContent = label;

      if (label === this.activePreset) {
        this.renderer.addClass(item, 'dp-preset-active');
      }

      item.addEventListener('click', (e) => {
        e.stopPropagation();

        if (label === 'Custom Range') {
          // ✅ Show calendar — reset any previous custom selection
          this.activePreset = 'Custom Range';
          this.selecting    = 'none';
          this.startDate    = null;
          this.endDate      = null;
          this.hoverDate    = null;
          this.renderDropdown();
        } else {
          // ✅ Instant apply — update input and close
          this.activePreset = label; // ✅ Set BEFORE close so next open is correct
          this.applyPreset(label);
          this.updateInput();
          this.closeDropdown();
        }
      });

      this.renderer.appendChild(presetPanel, item);
    });

    this.renderer.appendChild(this.dropdown, presetPanel);

    // ✅ Calendar panel — only shown for Custom Range
    if (this.activePreset === 'Custom Range') {
      const calPanel: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(calPanel, 'dp-cal-panel');

      const dualRow: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(dualRow, 'dp-dual-row');

      dualRow.appendChild(
        this.buildSingleCal(this.leftYear, this.leftMonth, 'left')
      );
      dualRow.appendChild(
        this.buildSingleCal(this.rightYear, this.rightMonth, 'right')
      );

      // Footer
      const footer: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(footer, 'dp-range-footer');

      const cancelBtn: HTMLButtonElement = this.renderer.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.type = 'button';
      this.renderer.addClass(cancelBtn, 'dp-cancel-btn');
      cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selecting = 'none';
        this.startDate = null;
        this.endDate   = null;
        this.hoverDate = null;
        this.closeDropdown();
      });

      const applyBtn: HTMLButtonElement = this.renderer.createElement('button');
      applyBtn.textContent = 'Apply';
      applyBtn.type = 'button';
      this.renderer.addClass(applyBtn, 'dp-apply-btn');
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.applyRange();
      });

      this.renderer.appendChild(footer, cancelBtn);
      this.renderer.appendChild(footer, applyBtn);
      this.renderer.appendChild(calPanel, dualRow);
      this.renderer.appendChild(calPanel, footer);
      this.renderer.appendChild(this.dropdown, calPanel);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BUILD ONE CALENDAR SIDE
  // ─────────────────────────────────────────────────────────────

  private buildSingleCal(
    year: number,
    month: number,
    side: 'left' | 'right'
  ): HTMLDivElement {
    const cal: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(cal, 'dp-single-cal');

    const header: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dp-header');

    const spacer = (): HTMLSpanElement => {
      const sp = document.createElement('span');
      sp.style.width   = '28px';
      sp.style.display = 'inline-block';
      return sp;
    };

    if (side === 'left') {
      header.appendChild(this.navBtn('&#8249;', () => {
        this.leftMonth--;
        if (this.leftMonth < 0) { this.leftMonth = 11; this.leftYear--; }
        this.rightMonth = this.leftMonth + 1;
        this.rightYear  = this.leftYear;
        if (this.rightMonth > 11) { this.rightMonth = 0; this.rightYear++; }
        this.renderDropdown();
      }));
    } else {
      header.appendChild(spacer());
    }

    const label: HTMLSpanElement = this.renderer.createElement('span');
    this.renderer.addClass(label, 'dp-header-label');
    label.textContent = `${this.SHORT_MONTHS[month]} ${year}`;
    header.appendChild(label);

    if (side === 'right') {
      header.appendChild(this.navBtn('&#8250;', () => {
        this.rightMonth++;
        if (this.rightMonth > 11) { this.rightMonth = 0; this.rightYear++; }
        this.leftMonth = this.rightMonth - 1;
        this.leftYear  = this.rightYear;
        if (this.leftMonth < 0) { this.leftMonth = 11; this.leftYear--; }
        this.renderDropdown();
      }));
    } else {
      header.appendChild(spacer());
    }

    cal.appendChild(header);

    // Day names row
    const dayRow: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(dayRow, 'dp-day-row');
    this.DAYS.forEach(d => {
      const cell: HTMLSpanElement = this.renderer.createElement('span');
      this.renderer.addClass(cell, 'dp-day-name');
      cell.textContent = d;
      dayRow.appendChild(cell);
    });
    cal.appendChild(dayRow);

    cal.appendChild(this.buildDateGrid(year, month));

    return cal;
  }

  // ─────────────────────────────────────────────────────────────
  // BUILD DATE GRID
  // ─────────────────────────────────────────────────────────────

  private buildDateGrid(year: number, month: number): HTMLDivElement {
    const grid: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(grid, 'dp-date-grid');

    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays    = new Date(year, month, 0).getDate();
    const today       = new Date();
    today.setHours(0, 0, 0, 0);

    // Prev month trailing days — muted
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.appendChild(this.makeCell(prevDays - i, true, false, false, false, false));
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);

      const isToday   = date.getTime() === today.getTime();
      const isStart   = this.startDate != null &&
                        date.getTime() === this.startDate.getTime();
      const isEnd     = this.endDate != null &&
                        date.getTime() === this.endDate.getTime();
      const rangeEnd  = this.endDate ?? this.hoverDate;
      const isInRange = this.startDate != null && rangeEnd != null
                        && date > this.startDate && date < rangeEnd;

      const cell = this.makeCell(d, false, isToday, isStart, isEnd, isInRange);

      // ✅ Store cell reference for class-only updates on hover
      const key = `${year}-${month}-${d}`;
      this.cellMap.set(key, { el: cell, date });

      // ✅ Hover — update classes only, no DOM rebuild
      cell.addEventListener('mouseenter', () => {
        if (this.selecting === 'start') {
          this.hoverDate = date;
          this.refreshCellClasses();
        }
      });

      // ✅ Two-click state machine
      cell.addEventListener('click', (e) => {
        e.stopPropagation();

        if (this.selecting === 'none') {
          // First click — set start
          this.startDate    = new Date(date);
          this.endDate      = null;
          this.hoverDate    = null;
          this.selecting    = 'start';
          this.refreshCellClasses();
          this.refreshPresetPanel();
        } else {
          // Second click — set end
          if (date.getTime() === this.startDate!.getTime()) {
            this.endDate = new Date(date);
          } else if (date < this.startDate!) {
            this.endDate   = new Date(this.startDate!);
            this.startDate = new Date(date);
          } else {
            this.endDate = new Date(date);
          }
          this.hoverDate = null;
          this.selecting = 'none';
          this.refreshCellClasses();
          this.refreshPresetPanel();
        }
      });

      grid.appendChild(cell);
    }

    // Next month leading days — muted
    const totalCells = firstDay + daysInMonth;
    const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      grid.appendChild(this.makeCell(i, true, false, false, false, false));
    }

    return grid;
  }

  // ─────────────────────────────────────────────────────────────
  // MAKE CELL
  // ─────────────────────────────────────────────────────────────

  private makeCell(
    day: number,
    muted: boolean,
    isToday: boolean,
    isStart: boolean,
    isEnd: boolean,
    isInRange: boolean
  ): HTMLDivElement {
    const cell: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(cell, 'dp-date-cell');
    cell.textContent = String(day);

    if (muted) {
      this.renderer.addClass(cell, 'dp-muted');
      return cell;
    }

    if (isStart || isEnd) this.renderer.addClass(cell, 'dp-range-end');
    else if (isToday)     this.renderer.addClass(cell, 'dp-today');
    if (isInRange)        this.renderer.addClass(cell, 'dp-in-range');

    return cell;
  }

  // ─────────────────────────────────────────────────────────────
  // REFRESH CELL CLASSES — No DOM rebuild, just CSS class updates
  // ─────────────────────────────────────────────────────────────

  private refreshCellClasses(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rangeEnd = this.endDate ?? this.hoverDate;

    this.cellMap.forEach(({ el, date }) => {
      const isToday   = date.getTime() === today.getTime();
      const isStart   = this.startDate != null &&
                        date.getTime() === this.startDate.getTime();
      const isEnd     = this.endDate != null &&
                        date.getTime() === this.endDate.getTime();
      const isInRange = this.startDate != null && rangeEnd != null
                        && date > this.startDate && date < rangeEnd;

      el.classList.remove('dp-range-end', 'dp-today', 'dp-in-range');

      if (isStart || isEnd) el.classList.add('dp-range-end');
      else if (isToday)     el.classList.add('dp-today');
      if (isInRange)        el.classList.add('dp-in-range');
    });
  }

  // ─────────────────────────────────────────────────────────────
  // REFRESH PRESET PANEL — Updates active highlight only
  // ─────────────────────────────────────────────────────────────

  private refreshPresetPanel(): void {
    const panel = this.dropdown.querySelector('.dp-preset-panel');
    if (!panel) return;
    panel.querySelectorAll('.dp-preset-item').forEach((item) => {
      const el = item as HTMLElement;
      if (el.textContent === this.activePreset) {
        el.classList.add('dp-preset-active');
      } else {
        el.classList.remove('dp-preset-active');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PRESETS
  // ─────────────────────────────────────────────────────────────

  private applyPreset(label: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (label) {
      case 'Today':
        this.startDate = new Date(today);
        this.endDate   = new Date(today);
        break;
      case 'Yesterday':
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        this.startDate = new Date(y);
        this.endDate   = new Date(y);
        break;
      case 'Last 7 Days':
        this.endDate   = new Date(today);
        this.startDate = new Date(today);
        this.startDate.setDate(today.getDate() - 6);
        break;
      case 'Last 30 Days':
        this.endDate   = new Date(today);
        this.startDate = new Date(today);
        this.startDate.setDate(today.getDate() - 29);
        break;
      case 'This Month':
        this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.endDate   = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'Last Month':
        this.startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        this.endDate   = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
    }
    this.selecting = 'none';
    this.hoverDate = null;
  }

  private syncCalendarMonths(): void {
    if (!this.startDate) return;
    this.leftMonth  = this.startDate.getMonth();
    this.leftYear   = this.startDate.getFullYear();
    this.rightMonth = this.leftMonth + 1;
    this.rightYear  = this.leftYear;
    if (this.rightMonth > 11) { this.rightMonth = 0; this.rightYear++; }
  }

  // ─────────────────────────────────────────────────────────────
  // APPLY RANGE — Custom Range apply button
  // ─────────────────────────────────────────────────────────────

  private applyRange(): void {
    if (this.startDate && this.endDate) {
      this.updateInput();
      this.selecting = 'none';
      this.closeDropdown();
    }
    // ✅ If both dates not picked yet — do nothing, keep calendar open
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATE INPUT — Writes DD/MM/YYYY - DD/MM/YYYY to input box
  // ─────────────────────────────────────────────────────────────

  private updateInput(): void {
    if (!this.startDate || !this.endDate) return;
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const value = `${fmt(this.startDate)} - ${fmt(this.endDate)}`;
    this.el.nativeElement.value = value;
    this.el.nativeElement.dispatchEvent(new Event('input',  { bubbles: true }));
    this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ─────────────────────────────────────────────────────────────
  // OPEN / CLOSE
  // ─────────────────────────────────────────────────────────────

  private toggleDropdown(): void {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.renderer.addClass(this.dropdown, 'dp-open');
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.hoverDate = null;
    this.renderer.removeClass(this.dropdown, 'dp-open');

    // ✅ Reset incomplete custom range on close
    if (this.selecting === 'start') {
      this.selecting = 'none';
      this.startDate = null;
      this.endDate   = null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────

  private navBtn(html: string, cb: () => void): HTMLButtonElement {
    const btn: HTMLButtonElement = this.renderer.createElement('button');
    this.renderer.addClass(btn, 'dp-nav-btn');
    btn.innerHTML = html;
    btn.type = 'button';
    btn.addEventListener('click', (e) => { e.stopPropagation(); cb(); });
    return btn;
  }

  private calendarSvg(): string {
    return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="14" height="12" rx="2" stroke="white" stroke-width="1.4"/>
      <path d="M1 7H15" stroke="white" stroke-width="1.4"/>
      <path d="M5 1V4M11 1V4" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`;
  }

  ngOnDestroy(): void {
    if (this.outsideClickListener) this.outsideClickListener();
  }
}