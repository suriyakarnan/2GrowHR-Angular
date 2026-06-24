import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2,
  Input,
} from '@angular/core';

@Directive({
  selector: 'select[selectpicker]',
  standalone: true,
})
export class SelectpickerDirective implements OnInit, OnDestroy {
  @Input() pickerPlaceholder: string = 'Search...';
  @Input() pickerLabel: string = 'Nothing selected';
  @Input() multiple: boolean = false;

  private wrapper!: HTMLDivElement;
  private trigger!: HTMLDivElement;
  private dropdown!: HTMLDivElement;
  private searchInput!: HTMLInputElement;
  private optionsList!: HTMLUListElement;
  private isOpen = false;
  private outsideClickListener!: () => void;

  private selectedValues: Set<string> = new Set();
  private selectedTexts: Map<string, string> = new Map();

  constructor(
    private el: ElementRef<HTMLSelectElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.buildUI();
    this.syncOptions();
    this.hideOriginalSelect();
  }

  // ─────────────────────────────────────────────────────────────
  // BUILD UI
  // ─────────────────────────────────────────────────────────────

  private buildUI(): void {
    const select = this.el.nativeElement;

    // Wrapper
    this.wrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.wrapper, 'sp-wrapper');

    // Trigger
    this.trigger = this.renderer.createElement('div');
    this.renderer.addClass(this.trigger, 'sp-trigger');
    this.trigger.innerHTML = `
      <span class="sp-label">${this.pickerLabel}</span>
      <span class="sp-arrow">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L6 8L10 4" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;

    // Dropdown panel
    this.dropdown = this.renderer.createElement('div');
    this.renderer.addClass(this.dropdown, 'sp-dropdown');

    // Search input
    this.searchInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.searchInput, 'type', 'text');
    this.renderer.setAttribute(this.searchInput, 'placeholder', this.pickerPlaceholder);
    this.renderer.addClass(this.searchInput, 'sp-search');

    // Select All / Deselect All row (only for multi-select)
    if (this.multiple) {
      const actionRow = this.renderer.createElement('div') as HTMLDivElement;
      this.renderer.addClass(actionRow, 'sp-action-row');

      const selectAllBtn = this.renderer.createElement('button') as HTMLButtonElement;
      selectAllBtn.textContent = 'Select All';
      this.renderer.addClass(selectAllBtn, 'sp-action-btn');
      selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectAll();
      });

      const deselectAllBtn = this.renderer.createElement('button') as HTMLButtonElement;
      deselectAllBtn.textContent = 'Deselect All';
      this.renderer.addClass(deselectAllBtn, 'sp-action-btn');
      deselectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deselectAll();
      });

      this.renderer.appendChild(actionRow, selectAllBtn);
      this.renderer.appendChild(actionRow, deselectAllBtn);
      this.renderer.appendChild(this.dropdown, this.searchInput);
      this.renderer.appendChild(this.dropdown, actionRow);
    } else {
      this.renderer.appendChild(this.dropdown, this.searchInput);
    }

    // Options list
    this.optionsList = this.renderer.createElement('ul');
    this.renderer.addClass(this.optionsList, 'sp-options');

    // Assemble DOM
    this.renderer.appendChild(this.dropdown, this.optionsList);
    this.renderer.appendChild(this.wrapper, this.trigger);
    this.renderer.appendChild(this.wrapper, this.dropdown);

    // Insert wrapper before original <select>
    this.renderer.insertBefore(select.parentNode, this.wrapper, select);
    this.renderer.appendChild(this.wrapper, select);

    // Trigger click
    this.trigger.addEventListener('click', () => this.toggleDropdown());

    // Search filter
    this.searchInput.addEventListener('input', () => this.filterOptions());

    // Outside click closes dropdown
    this.outsideClickListener = this.renderer.listen(
      'document',
      'click',
      (e: MouseEvent) => {
        if (!this.wrapper.contains(e.target as Node)) {
          this.closeDropdown();
        }
      }
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SYNC OPTIONS FROM NATIVE <select>
  // ─────────────────────────────────────────────────────────────

  private syncOptions(): void {
    const select = this.el.nativeElement;
    this.optionsList.innerHTML = '';

    let hasSelected = false;

    Array.from(select.options).forEach((opt) => {
      if (opt.value === '' || opt.value === null) return;

      const li = this.renderer.createElement('li') as HTMLLIElement;
      li.dataset['value'] = opt.value;

      if (this.multiple) {
        li.innerHTML = `
          <span class="sp-option-text">${opt.text}</span>
          <span class="sp-check" style="display:none;">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7L5.5 10.5L12 4" stroke="#405189" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        `;

        // ✅ Restore selected state if already in selectedValues
        if (this.selectedValues.has(opt.value)) {
          this.renderer.addClass(li, 'sp-selected');
          const check = li.querySelector('.sp-check') as HTMLElement;
          if (check) check.style.display = 'flex';
        }

        li.addEventListener('click', () =>
          this.toggleMultiOption(li, opt.value, opt.text)
        );
      } else {
        li.textContent = opt.text;
        if (opt.selected && opt.value !== '') {
          this.renderer.addClass(li, 'sp-selected');
          this.setLabel(opt.text, true);
          hasSelected = true;
        }
        li.addEventListener('click', () =>
          this.selectOption(li, opt.value, opt.text)
        );
      }

      this.renderer.appendChild(this.optionsList, li);
    });

    if (!hasSelected && !this.multiple) {
      this.setLabel(this.pickerLabel, false);
    }

    if (this.multiple && this.selectedValues.size === 0) {
      this.setLabel(this.pickerLabel, false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SINGLE SELECT
  // ─────────────────────────────────────────────────────────────

  private selectOption(li: HTMLLIElement, value: string, text: string): void {
    this.optionsList.querySelectorAll('li').forEach((item) => {
      item.classList.remove('sp-selected');
    });

    this.renderer.addClass(li, 'sp-selected');
    this.setLabel(text, true);

    this.el.nativeElement.value = value;
    this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));

    this.closeDropdown();
  }

  // ─────────────────────────────────────────────────────────────
  // MULTI SELECT — TOGGLE OPTION
  // ─────────────────────────────────────────────────────────────

  private toggleMultiOption(li: HTMLLIElement, value: string, text: string): void {
    const check = li.querySelector('.sp-check') as HTMLElement;

    if (this.selectedValues.has(value)) {
      this.selectedValues.delete(value);
      this.selectedTexts.delete(value);
      this.renderer.removeClass(li, 'sp-selected');
      if (check) check.style.display = 'none';
    } else {
      this.selectedValues.add(value);
      this.selectedTexts.set(value, text);
      this.renderer.addClass(li, 'sp-selected');
      if (check) check.style.display = 'flex';
    }

    this.updateMultiLabel();
    this.syncNativeMultiSelect();
  }

  // ─────────────────────────────────────────────────────────────
  // SELECT ALL / DESELECT ALL
  // ─────────────────────────────────────────────────────────────

  private selectAll(): void {
    this.optionsList.querySelectorAll('li').forEach((li) => {
      const htmlLi = li as HTMLLIElement;
      const value = htmlLi.dataset['value'] || '';
      const text = htmlLi.querySelector('.sp-option-text')?.textContent || '';
      const check = htmlLi.querySelector('.sp-check') as HTMLElement;

      if (htmlLi.style.display !== 'none') {
        this.selectedValues.add(value);
        this.selectedTexts.set(value, text);
        this.renderer.addClass(htmlLi, 'sp-selected');
        if (check) check.style.display = 'flex';
      }
    });

    this.updateMultiLabel();
    this.syncNativeMultiSelect();
  }

  private deselectAll(): void {
    this.selectedValues.clear();
    this.selectedTexts.clear();

    this.optionsList.querySelectorAll('li').forEach((li) => {
      li.classList.remove('sp-selected');
      const check = li.querySelector('.sp-check') as HTMLElement;
      if (check) check.style.display = 'none';
    });

    this.updateMultiLabel();
    this.syncNativeMultiSelect();
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATE LABEL FOR MULTI SELECT
  // ─────────────────────────────────────────────────────────────

  private updateMultiLabel(): void {
    if (this.selectedTexts.size === 0) {
      this.setLabel(this.pickerLabel, false);
    } else {
      const joined = Array.from(this.selectedTexts.values()).join(', ');
      this.setLabel(joined, true);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SYNC NATIVE <select multiple> — keeps ngModel working
  // ─────────────────────────────────────────────────────────────

  private syncNativeMultiSelect(): void {
    const select = this.el.nativeElement;
    Array.from(select.options).forEach((opt) => {
      opt.selected = this.selectedValues.has(opt.value);
    });
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ─────────────────────────────────────────────────────────────
  // SEARCH FILTER
  // ─────────────────────────────────────────────────────────────

  private filterOptions(): void {
    const query = this.searchInput.value.toLowerCase().trim();
    this.optionsList.querySelectorAll('li').forEach((li) => {
      const text = li.textContent?.toLowerCase() || '';
      (li as HTMLElement).style.display = text.includes(query) ? '' : 'none';
    });
  }

  // ─────────────────────────────────────────────────────────────
  // OPEN / CLOSE
  // ─────────────────────────────────────────────────────────────

  private toggleDropdown(): void {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.renderer.addClass(this.dropdown, 'sp-open');
    this.renderer.addClass(this.trigger, 'sp-active');
    this.searchInput.value = '';
    this.filterOptions();
    setTimeout(() => this.searchInput.focus(), 50);
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.renderer.removeClass(this.dropdown, 'sp-open');
    this.renderer.removeClass(this.trigger, 'sp-active');
  }

  // ─────────────────────────────────────────────────────────────
  // SET LABEL
  // ─────────────────────────────────────────────────────────────

  private setLabel(text: string, hasValue: boolean): void {
    const label = this.trigger.querySelector('.sp-label');
    if (label) {
      label.textContent = text;
      if (hasValue) {
        label.classList.add('sp-has-value');
      } else {
        label.classList.remove('sp-has-value');
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // HIDE NATIVE SELECT
  // ─────────────────────────────────────────────────────────────

  private hideOriginalSelect(): void {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }

  // ─────────────────────────────────────────────────────────────
  // ✅ PUBLIC REFRESH — called from component after *ngFor renders
  // ─────────────────────────────────────────────────────────────

  public refresh(): void {
    this.syncOptions();
  }

  // ─────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    if (this.outsideClickListener) {
      this.outsideClickListener();
    }
  }
}