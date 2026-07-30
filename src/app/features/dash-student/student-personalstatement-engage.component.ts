import { Component, Input, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogEntryInterestCriteria, CatalogEntryInterestGETData, HcclService } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryInterestListComponent } from "@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component";
import { OnDeleteClickBehavior, OnFinishLoadingBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { StudentEngageInterestComponent } from './student-engage-interest/student-engage-interest.component';

@Component({
  selector: 'app-student-personalstatement-engage',
  standalone: true,
  imports: [CommonModule, CatalogEntryInterestListComponent, StudentEngageInterestComponent],
  templateUrl: './student-personalstatement-engage.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class StudentPersonalStatementEngageComponent 
extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  @ViewChild(CatalogEntryInterestListComponent) interestListComponent?: CatalogEntryInterestListComponent;

  // Properties referenced in template
  error: any = null;
  protected interestId: string = '';
  protected cdr = inject(ChangeDetectorRef);
  protected showInterestList: boolean = true;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('StudentPersonalStatementEngageComponent ngOnInit');
    this.entity = await PersonalStatementCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
  }

  protected override async prepareModeEntry(entity: PersonalStatementCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('StudentPersonalStatementEngageComponent prepareModeEntry ' + this.entity.dump);
    return Promise.resolve();
  }

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      personalStatementId: this.id,
      interestRangeMin: 5,
      interestRangeMax: 11,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected async loadEntityByIdCall(id: string): Promise<PersonalStatementCrudWrapper> {
    return PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
  }

  // Methods for interest selection behavior (same as student-engage.component.ts)
  protected getSelectedInterestId(): string {
    return this.interestId;
  }

  protected setSelectedInterestId(interestId: string): void {
    this.interestId = interestId;
    this.cdr.detectChanges(); // Trigger change detection to update child component
  }

  protected onInterestRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior = new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'interest';
    x.alertMessage = 'Message';
    x.usingNavigateUrl = false;
    x.onRowClick = (id: string) => {
      this.setSelectedInterestId(id);
    };
    return x;
  }

  protected onFinishLoadingBehavior(): OnFinishLoadingBehavior {
    var x: OnFinishLoadingBehavior = new OnFinishLoadingBehavior();
    x.onFinishLoading = (id: string, data: any) => {
     // this.setSelectedInterestId(id);
    };
    return x;
  }

  getInterestDeleteBehavior(): OnDeleteClickBehavior {
    var x: OnDeleteClickBehavior = new OnDeleteClickBehavior();
    x.clicked = (entityId: string) => {
      this.hcclService.deleteCatalogEntryInterestById(entityId).subscribe({
        next: () => {
          this.interestId = '';
          this.setSelectedInterestId('');
          this.onChildComponentRefresh();
          alert('Interest deleted successfully');
        },
        error: () => {
          alert('Error deleting interest');
        },
      });
    };
    return x;
  }

  /**
   * Handle refresh request from child component (e.g., after modal actions)
   */
  onChildComponentRefresh(): void {
    console.log('onChildComponentRefresh called');
    
    // Store current selection
    const currentInterestId = this.interestId;
    
    // Force complete destruction and recreation of the list component
    this.showInterestList = false;
    this.cdr.detectChanges();
    
    // Use setTimeout to ensure the component is fully destroyed before recreating
    setTimeout(() => {
      this.showInterestList = true;
      this.cdr.detectChanges();
      
      // Restore selection after a brief delay to allow list to load
      if (currentInterestId) {
        setTimeout(() => {
          this.setSelectedInterestId(currentInterestId);
        }, 200);
      }
    }, 100);
  }
}

