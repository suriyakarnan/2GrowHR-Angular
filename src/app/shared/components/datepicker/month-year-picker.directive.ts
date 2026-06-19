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

    // ✅ Safe DOM insertion
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

  // ─── RENDER DROPDOWN ────────────────────────────────────────

  private renderDropdown(): void {
    this.dropdown.innerHTML = '';

    // Header row
    const header: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dp-header');

    const prevBtn = this.navBtn('&#8249;', () => {
      this.currentYear--;
      this.renderDropdown();
    });

    const yearLabel: HTMLSpanElement = this.renderer.createElement('span');
    this.renderer.addClass(yearLabel, 'dp-header-label');
    yearLabel.textContent = `Year ${this.currentYear}`;

    const nextBtn = this.navBtn('&#8250;', () => {
      this.currentYear++;
      this.renderDropdown();
    });

    this.renderer.appendChild(header, prevBtn);
    this.renderer.appendChild(header, yearLabel);
    this.renderer.appendChild(header, nextBtn);
    this.renderer.appendChild(this.dropdown, header);

    // Month grid
    const grid: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(grid, 'dp-month-grid');

    this.MONTHS.forEach((month, index) => {
      const cell: HTMLDivElement = this.renderer.createElement('div');
      this.renderer.addClass(cell, 'dp-month-cell');
      cell.textContent = month;

      if (
        index === this.selectedMonth &&
        this.currentYear === this.selectedYear
      ) {
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