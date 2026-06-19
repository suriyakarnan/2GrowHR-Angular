import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDatatable]',
  standalone: true
})
export class TableDatatableDirective implements AfterViewInit {
  @Input() rowsPerPage: number = 10;

  @Input() sortable = true;

  private allRows: HTMLElement[] = [];
  private currentPage = 1;
  private searchBox!: HTMLInputElement;
  private entriesSelect!: HTMLSelectElement;
  private paginationWrapper!: HTMLElement;
  private showingText!: HTMLElement;
  private tbody!: HTMLElement;

  private sortColumn = -1;
  private sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private el: ElementRef<HTMLTableElement>, private renderer: Renderer2) {}

  ngAfterViewInit(): void {

    

    const table = this.el.nativeElement;
    this.renderer.addClass(table, 'app-datatable');

    this.tbody = table.querySelector('tbody') as HTMLElement;
    if (!this.tbody) return;

    this.allRows = Array.from(this.tbody.querySelectorAll('tr')).filter(
      tr => !tr.hasAttribute('data-empty-row')
    );

    if (this.sortable) {
      this.initializeSorting();
    }

    this.buildTopBar(table);
    this.buildBottomBar(table);
    this.renderPage(1);

    
  }

  private buildTopBar(table: HTMLTableElement) {
    const topBar = this.renderer.createElement('div');
    this.renderer.addClass(topBar, 'app-dt-top');

    // left: Show [10] entries
    const showWrap = this.renderer.createElement('div');
    this.renderer.addClass(showWrap, 'app-dt-show');

    const showLabel = this.renderer.createElement('span');
    this.renderer.setProperty(showLabel, 'textContent', 'Show');

    this.entriesSelect = this.renderer.createElement('select');
    this.renderer.addClass(this.entriesSelect, 'app-dt-entries-select');
    [10, 25, 50, 100].forEach(n => {
      const opt = this.renderer.createElement('option');
      this.renderer.setProperty(opt, 'value', n);
      this.renderer.setProperty(opt, 'textContent', String(n));
      if (n === this.rowsPerPage) this.renderer.setProperty(opt, 'selected', true);
      this.renderer.appendChild(this.entriesSelect, opt);
    });
    this.entriesSelect.addEventListener('change', () => {
      this.rowsPerPage = parseInt(this.entriesSelect.value, 10);
      this.renderPage(1);
    });

    const entriesLabel = this.renderer.createElement('span');
    this.renderer.setProperty(entriesLabel, 'textContent', 'entries');

    this.renderer.appendChild(showWrap, showLabel);
    this.renderer.appendChild(showWrap, this.entriesSelect);
    this.renderer.appendChild(showWrap, entriesLabel);

    // right: search box
    const searchWrap = this.renderer.createElement('div');
    this.renderer.addClass(searchWrap, 'app-dt-search');

    this.searchBox = this.renderer.createElement('input');
    this.renderer.setAttribute(this.searchBox, 'type', 'text');
    this.renderer.setAttribute(this.searchBox, 'placeholder', 'Search...');
    this.renderer.addClass(this.searchBox, 'app-dt-search-input');
    this.searchBox.addEventListener('input', () => this.applySearch());

    this.renderer.appendChild(searchWrap, this.searchBox);

    this.renderer.appendChild(topBar, showWrap);
    this.renderer.appendChild(topBar, searchWrap);

    table.parentElement?.insertBefore(topBar, table);
  }

  private buildBottomBar(table: HTMLTableElement) {
    const bottomBar = this.renderer.createElement('div');
    this.renderer.addClass(bottomBar, 'app-dt-bottom');

    this.showingText = this.renderer.createElement('span');
    this.renderer.addClass(this.showingText, 'app-dt-showing-text');

    this.paginationWrapper = this.renderer.createElement('nav');
    this.renderer.addClass(this.paginationWrapper, 'app-dt-pagination-nav');

    this.renderer.appendChild(bottomBar, this.showingText);
    this.renderer.appendChild(bottomBar, this.paginationWrapper);

    table.parentElement?.insertBefore(bottomBar, table.nextSibling);
  }

  private getFilteredRows(): HTMLElement[] {
    const term = (this.searchBox?.value || '').toLowerCase().trim();
    if (!term) return this.allRows;
    return this.allRows.filter(tr => tr.textContent?.toLowerCase().includes(term));
  }

  private applySearch() {
    this.renderPage(1);
  }

  private renderPage(page: number) {
    const rows = this.getFilteredRows();
    const totalEntries = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / this.rowsPerPage));
    this.currentPage = Math.min(page, totalPages);

    this.allRows.forEach(tr => this.renderer.setStyle(tr, 'display', 'none'));

    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const pageRows = rows.slice(start, end);
    pageRows.forEach(tr => this.renderer.setStyle(tr, 'display', ''));

    const shownStart = totalEntries === 0 ? 0 : start + 1;
    const shownEnd = Math.min(end, totalEntries);
    this.showingText.textContent = `Showing ${shownStart} to ${shownEnd} of ${totalEntries} entries`;

    this.renderPagination(totalPages);
  }

  private renderPagination(totalPages: number) {
    this.paginationWrapper.innerHTML = '';
    const ul = this.renderer.createElement('ul');
    this.renderer.addClass(ul, 'app-dt-pagination');

    const makeItem = (label: string, page: number, disabled = false, active = false) => {
      const li = this.renderer.createElement('li');
      this.renderer.addClass(li, 'app-dt-page-item');
      if (disabled) this.renderer.addClass(li, 'disabled');
      if (active) this.renderer.addClass(li, 'active');

      const a = this.renderer.createElement('a');
      this.renderer.addClass(a, 'app-dt-page-link');
      this.renderer.setAttribute(a, 'href', 'javascript:void(0)');
      this.renderer.setProperty(a, 'textContent', label);

      if (!disabled) {
        a.addEventListener('click', () => this.renderPage(page));
      }

      this.renderer.appendChild(li, a);
      return li;
    };

    this.renderer.appendChild(ul, makeItem('Previous', this.currentPage - 1, this.currentPage === 1));

    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      this.renderer.appendChild(ul, makeItem('1', 1, false, this.currentPage === 1));
      if (startPage > 2) {
        this.renderer.appendChild(ul, makeItem('...', 0, true));
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      if (p === 1 && startPage > 1) continue;
      this.renderer.appendChild(ul, makeItem(String(p), p, false, p === this.currentPage));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        this.renderer.appendChild(ul, makeItem('...', 0, true));
      }
      this.renderer.appendChild(ul, makeItem(String(totalPages), totalPages, false, this.currentPage === totalPages));
    }

    this.renderer.appendChild(ul, makeItem('Next', this.currentPage + 1, this.currentPage === totalPages));
    this.renderer.appendChild(this.paginationWrapper, ul);
  }

  private initializeSorting(): void {
  const headers = this.el.nativeElement.querySelectorAll('thead th');

  headers.forEach((th, index) => {
    this.renderer.setStyle(th, 'cursor', 'pointer');

    th.addEventListener('click', () => {
      this.sortTable(index);
    });
  });
  }

 private sortTable(columnIndex: number): void {

  if (this.sortColumn === columnIndex) {
    this.sortDirection =
      this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = columnIndex;
    this.sortDirection = 'asc';
  }

  this.allRows.sort((a, b) => {

    const aText = a.children[columnIndex]?.textContent?.trim() || '';
    const bText = b.children[columnIndex]?.textContent?.trim() || '';

    const aNumber = parseFloat(aText);
    const bNumber = parseFloat(bText);

    let result = 0;

    if (!isNaN(aNumber) && !isNaN(bNumber)) {
      result = aNumber - bNumber;
    } else {
      result = aText.localeCompare(bText);
    }

    return this.sortDirection === 'asc'
      ? result
      : -result;
  });

  // IMPORTANT
  this.allRows.forEach(row => {
    this.tbody.appendChild(row);
  });

  this.renderPage(1);

  
}
}