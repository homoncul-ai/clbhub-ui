import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import { CatalogEntryListComponent } from './catalogentry-list.component';

/**
 * Catalog search list for Research. Uses CatalogEntryListComponent search/filter
 * behavior (client-side text filter over a broader fetch — avoids broken QA
 * searchByText SQL until the service fix is deployed).
 */
@Component({
  selector: 'app-catalog-search-list',
  standalone: true,
  templateUrl: './catalogentry-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule, SimpleButtonbarComponent],
})
export class CatalogSearchListComponent extends CatalogEntryListComponent {
  constructor(protected override router: Router) {
    super(router);
    this.searchHeading = 'Catalog Search';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
    this.showingGoButton = false;
  }
}
