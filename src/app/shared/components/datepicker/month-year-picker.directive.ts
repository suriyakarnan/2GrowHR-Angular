import {
  Directive, ElementRef, OnInit, OnDestroy, Renderer2, Input
} from '@angular/core';

@Directive({
  selector: 'input[monthYearPicker]',
  standalone: true,
})
export class MonthYearPickerDirective implements OnInit, OnDestroy {
  @Input() pickerIcon: boolean = true;

  private wrapper!: HTMLDivElement;
  private dropdown!: HTMLDivElement;
  private iconBtn!: HTMLButtonElement;
  private outsideClickListener!: () => void;

  private currentYear!: number;
  private selectedMonth!: number;
  private selectedYear!: number;
  private isOpen = false;

  private view: 'month' | 'year' = 'month';
  private yearPageStart!: number;

  private readonly MONTHS = [
    'Jan.', 'Feb.', 'Mar.',
    'Apr.', 'May',  'June',
    'July', 'Aug.', 'Sep.',
    'Oct.', 'Nov.', 'Dec.'
  ];

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.currentYear   = now.getFullYear();
    this.selectedMonth = now.getMonth();
    this.selectedYear  = now.getFullYear();
    this.yearPageStart = this.currentYear - 4;
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
    this.renderer.setAttribute(input, 'placeholder', 'MM/YYYY');

    this.iconBtn = this.renderer.createElement('button');
    this.renderer.addClass(this.iconBtn, 'dp-icon-btn');
    this.iconBtn.innerHTML = this.calendarSvg();
    this.iconBtn.type = 'button';

    this.dropdown = this.renderer.createElement('div');
    this.renderer.addClass(this.dropdown, 'dp-dropdown');

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

  // ─── RENDER DROPDOWN (router) ────────────────────────────────

  private renderDropdown(): void {
    this.dropdown.innerHTML = '';
    if (this.view === 'year') {
      this.renderYearView();
    } else {
      this.renderMonthView();
    }
  }

  // ─── MONTH VIEW ─────────────────────────────────────────────

  private renderMonthView(): void {
    const header = this.makeHeader();

    const prevBtn = this.navBtn('&#8249;', () => {
      this.currentYear--;
      this.renderDropdown();
    });

    const yearLabel: HTMLSpanElement = this.renderer.createElement('span');
    this.renderer.addClass(yearLabel, 'dp-header-label');
    this.renderer.addClass(yearLabel, 'dp-header-label--clickable');
    yearLabel.textContent = `Year ${this.currentYear}`;
    yearLabel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.yearPageStart = this.currentYear - 4; // always center on current year
      this.view = 'year';
      this.renderDropdown();
    });

    const nextBtn = this.navBtn('&#8250;', () => {
      this.currentYear++;
      this.renderDropdown();
    });

    this.renderer.appendChild(header, prevBtn);
    this.renderer.appendChild(header, yearLabel);
    this.renderer.appendChild(header, nextBtn);
    this.renderer.appendChild(this.dropdown, header);

    const grid: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(grid, 'dp-month-grid');

    this.MONTHS.forEach((month, index) => {
      const cell: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(cell, 'dp-month-cell');
      cell.textContent = month;

      if (index === this.selectedMonth && this.currentYear === this.selectedYear) {
        this.renderer.addClass(cell, 'dp-month-selected');
      }

      cell.addEventListener('click', () => {
        this.selectedMonth = index;
        this.selectedYear  = this.currentYear;
        const mm = String(index + 1).padStart(2, '0');
        this.el.nativeElement.value = `${mm}/${this.currentYear}`;
        this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
        this.renderDropdown();
        this.closeDropdown();
      });

      this.renderer.appendChild(grid, cell);
    });

    this.renderer.appendChild(this.dropdown, grid);
  }

  // ─── YEAR VIEW ──────────────────────────────────────────────

  private renderYearView(): void {
    const PAGE = 12;

    const header = this.makeHeader();

    const prevBtn = this.navBtn('&#8249;', () => {
      this.yearPageStart -= PAGE;
      this.renderDropdown();
    });

    const backLabel: HTMLSpanElement = this.renderer.createElement('span');
    this.renderer.addClass(backLabel, 'dp-header-label');
    this.renderer.addClass(backLabel, 'dp-header-label--clickable');
    backLabel.textContent = `Back to ${this.currentYear}`;
    backLabel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.view = 'month';
      this.renderDropdown();
    });

    const nextBtn = this.navBtn('&#8250;', () => {
      this.yearPageStart += PAGE;
      this.renderDropdown();
    });

    this.renderer.appendChild(header, prevBtn);
    this.renderer.appendChild(header, backLabel);
    this.renderer.appendChild(header, nextBtn);
    this.renderer.appendChild(this.dropdown, header);

    const grid: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(grid, 'dp-month-grid');

    for (let i = 0; i < PAGE; i++) {
      const year = this.yearPageStart + i;
      const cell: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(cell, 'dp-month-cell');
      cell.textContent = String(year);

      if (year === this.currentYear) {
        this.renderer.addClass(cell, 'dp-month-selected');
      }

      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentYear   = year;
        this.yearPageStart = year - 4; // re-center for next time year view opens
        this.view          = 'month';
        this.renderDropdown();
      });

      this.renderer.appendChild(grid, cell);
    }

    this.renderer.appendChild(this.dropdown, grid);
  }

  // ─── HELPERS ────────────────────────────────────────────────

  private makeHeader(): HTMLDivElement {
    const header: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dp-header');
    return header;
  }

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