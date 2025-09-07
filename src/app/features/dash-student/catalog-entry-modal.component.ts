import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';

@Component({
  selector: 'app-catalog-entry-modal',
  standalone: true,
  imports: [CommonModule, CatalogEntryCrudComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Catalog Entry Details</h5>
      <!-- Navigation buttons -->
      <div class="ms-auto me-3">
        <button type="button" 
                class="btn btn-outline-secondary btn-sm me-2" 
                (click)="goToPrevious()"
                [disabled]="currentIndex <= 0">
          <i class="fas fa-chevron-left"></i> Prev
        </button>
        <button type="button" 
                class="btn btn-outline-secondary btn-sm" 
                (click)="goToNext()"
                [disabled]="currentIndex >= totalEntries - 1">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <!-- Catalog Entry CRUD Component -->
      <app-catalogentry-crud 
        *ngIf="showComponent"
        [id]="getCurrentEntryId()" 
        mode="section">
      </app-catalogentry-crud>
    </div>
    <div class="modal-footer">
      <!-- Action buttons -->
      <button type="button" 
              class="btn btn-outline-danger" 
              (click)="markNotInterested()">
        Not Interested
      </button>
      <button type="button" 
              class="btn btn-success" 
              (click)="markInterested()">
        Interested
      </button>
      <button type="button" 
              class="btn btn-secondary" 
              (click)="closeModal()">
        Cancel
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      display: flex;
      align-items: center;
    }
  `]
})
export class CatalogEntryModalComponent implements OnInit {
  entries: any[] = [];
  currentIndex: number = 0;
  componentKey: number = 0;
  showComponent: boolean = true;
  
  constructor(
    public modalRef: MdbModalRef<CatalogEntryModalComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get data from modal service
    if (this.modalRef && (this.modalRef as any).data) {
      this.entries = (this.modalRef as any).data.entries || [];
      this.currentIndex = (this.modalRef as any).data.currentIndex || 0;
      console.log('Modal initialized with:', {
        entries: this.entries,
        currentIndex: this.currentIndex,
        totalEntries: this.totalEntries
      });
    } else {
      console.log('No modal data found');
    }
  }

  get totalEntries(): number {
    return this.entries?.length || 0;
  }

  getCurrentEntryId(): string | undefined {
    const entryId = this.entries && this.currentIndex < this.entries.length 
      ? this.entries[this.currentIndex].id 
      : undefined;
    console.log('getCurrentEntryId called:', {
      currentIndex: this.currentIndex,
      entriesLength: this.entries?.length,
      entryId: entryId
    });
    return entryId;
  }

  goToPrevious(): void {
    console.log('goToPrevious called, currentIndex:', this.currentIndex, 'totalEntries:', this.totalEntries);
    if (this.currentIndex > 0) {
      // Hide component temporarily to force recreation
      this.showComponent = false;
      this.cdr.detectChanges();
      
      this.currentIndex--;
      this.componentKey++;
      
      // Show component again with new data
      setTimeout(() => {
        this.showComponent = true;
        this.cdr.detectChanges();
        console.log('Moved to previous, new currentIndex:', this.currentIndex, 'componentKey:', this.componentKey);
      }, 10);
    }
  }

  goToNext(): void {
    console.log('goToNext called, currentIndex:', this.currentIndex, 'totalEntries:', this.totalEntries);
    if (this.currentIndex < this.totalEntries - 1) {
      // Hide component temporarily to force recreation
      this.showComponent = false;
      this.cdr.detectChanges();
      
      this.currentIndex++;
      this.componentKey++;
      
      // Show component again with new data
      setTimeout(() => {
        this.showComponent = true;
        this.cdr.detectChanges();
        console.log('Moved to next, new currentIndex:', this.currentIndex, 'componentKey:', this.componentKey);
      }, 10);
    }
  }

  markNotInterested(): void {
    const currentEntry = this.entries?.[this.currentIndex];
    console.log('Not Interested:', currentEntry?.title || 'Unknown entry');
    
    if (this.currentIndex < this.totalEntries - 1) {
      this.goToNext();
    } else {
      this.closeModal();
    }
  }

  markInterested(): void {
    const currentEntry = this.entries?.[this.currentIndex];
    console.log('Interested:', currentEntry?.title || 'Unknown entry');
    
    if (this.currentIndex < this.totalEntries - 1) {
      this.goToNext();
    } else {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
