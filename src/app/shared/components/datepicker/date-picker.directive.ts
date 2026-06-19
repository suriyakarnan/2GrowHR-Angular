import {
  Directive, ElementRef, OnInit, OnDestroy, Renderer2
} from '@angular/core';

@Directive({
  selector: 'input[datePicker]',
  standalone: true,
})
export class DatePickerDirective implements OnInit, OnDestroy {

  private wrapper!: HTMLDivElement;
  private dropdown!: HTMLDivElement;
  private iconBtn!: HTMLButtonElement;
  private outsideClickListener!: () => void;

  private currentYear!: number;
  private currentMonth!: number;
  private selectedDate: Date | null = null;
  private isOpen = false;

  private readonly DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  private readonly MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const now        = new Date();
    this.currentYear  = now.getFullYear();
    this.currentMonth = now.getMonth();
    this.buildUI();
  }

  // ─── BUILD UI ───────────────────────────────────────────────

  private buildUI(): void {
    const input = this.el.nativeElement;

    this.wrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.wrapper, 'dp-wrapper');

    const inputRow: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(inputRow, 'dp-input-row');

    this.renderer.addClass(input, 'dp-input');
    this.renderer.setAttribute(input, 'readonly', 'true');
    this.renderer.setAttribute(input, 'placeholder', 'Select date');

    this.iconBtn = this.renderer.createElement('button');
    this.renderer.addClass(this.iconBtn, 'dp-icon-btn');
    this.iconBtn.innerHTML = this.calendarSvg();
    this.iconBtn.type = 'button';

    this.dropdown = this.renderer.createElement('div');
    this.renderer.addClass(this.dropdown, 'dp-dropdown');
    this.renderer.addClass(this.dropdown, 'dp-single');

    // ✅ Safe DOM insertion
    const parent = input.parentNode as HTMLElement;
    parent.replaceChild(this.wrapper, input);
    this.renderer.appendChild(inputRow, input);
    this.renderer.appendChild(inputRow, this.iconBtn);
    this.renderer.appendChild(this.wrapper, inputRow);
    this.renderer.appendChild(this.wrapper, this.dropdown);

    this.renderCalendar();

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

  // ─── RENDER CALENDAR ────────────────────────────────────────

  private renderCalendar(): void {
    this.dropdown.innerHTML = '';

    // Header
    const header: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dp-header');

    const prevBtn = this.navBtn('&#8249;', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
      this.renderCalendar();
    });

    const label: HTMLSpanElement = this.renderer.createElement('span');
    this.renderer.addClass(label, 'dp-header-label');
    label.textContent = `${this.MONTHS[this.currentMonth]} ${this.currentYear}`;

    const nextBtn = this.navBtn('&#8250;', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
      this.renderCalendar();
    });

    this.renderer.appendChild(header, prevBtn);
    this.renderer.appendChild(header, label);
    this.renderer.appendChild(header, nextBtn);
    this.renderer.appendChild(this.dropdown, header);

    // Day headers
    const dayRow: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(dayRow, 'dp-day-row');
    this.DAYS.forEach(d => {
      const cell: HTMLSpanElement = this.renderer.createElement('span');
      this.renderer.addClass(cell, 'dp-day-name');
      cell.textContent = d;
      this.renderer.appendChild(dayRow, cell);
    });
    this.renderer.appendChild(this.dropdown, dayRow);

    // Dates grid
    const grid: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(grid, 'dp-date-grid');

    const firstDay  = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const prevDays  = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const today     = new Date();

    // Prev month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.appendChild(this.dateCell(prevDays - i, true, false, false, false));
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday    = today.getDate() === d &&
                         today.getMonth() === this.currentMonth &&
                         today.getFullYear() === this.currentYear;
      const isSelected = this.selectedDate?.getDate() === d &&
                         this.selectedDate?.getMonth() === this.currentMonth &&
                         this.selectedDate?.getFullYear() === this.currentYear;

      const cell = this.dateCell(d, false, isToday, isSelected, true);
      cell.addEventListener('click', () => {
        this.selectedDate = new Date(this.currentYear, this.currentMonth, d);
        const dd = String(d).padStart(2, '0');
        const mm = String(this.currentMonth + 1).padStart(2, '0');
        this.el.nativeElement.value = `${dd}/${mm}/${this.currentYear}`;
        this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
        this.renderCalendar();
        this.closeDropdown();
      });

      grid.appendChild(cell);
    }

    // Next month leading days
    const totalCells = firstDay + daysInMonth;
    const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      grid.appendChild(this.dateCell(i, true, false, false, false));
    }

    this.renderer.appendChild(this.dropdown, grid);
  }

  // ─── DATE CELL ──────────────────────────────────────────────

  private dateCell(
    day: number,
    muted: boolean,
    isToday: boolean,
    isSelected: boolean,
    clickable: boolean
  ): HTMLDivElement {
    const cell: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(cell, 'dp-date-cell');
    cell.textContent = String(day);

    if (muted)      this.renderer.addClass(cell, 'dp-muted');
    if (isToday)    this.renderer.addClass(cell, 'dp-today');
    if (isSelected) this.renderer.addClass(cell, 'dp-selected');

    return cell;
  }

  // ─── HELPERS ────────────────────────────────────────────────

  private navBtn(html: string, cb: () => void): HTMLButtonElement {
    const btn: HTMLButtonElement = this.renderer.createElement('button');
    this.renderer.addClass(btn, 'dp-nav-btn');
    btn.innerHTML = html;
    btn.type = 'button';
    btn.addEventListener('click', (e) => { e.stopPropagation(); cb(); });
    return btn;
  }

  private toggleDropdown(): void {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.renderer.addClass(this.dropdown, 'dp-open');
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.renderer.removeClass(this.dropdown, 'dp-open');
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