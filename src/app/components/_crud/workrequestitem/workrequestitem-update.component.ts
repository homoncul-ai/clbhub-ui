// This component handles all WorkRequestItem operations
// It displays the work request item details and action-specific content

import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { HcclService, WorkItemDeliverableCriteria, WorkItemFormRequest, WorkItemFormResponse } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { WorkRequestItemEnqueueRFIComponent } from './workrequestitem-enqueuerfi.component';
import { WorkRequestItemAttachRFIContentAddEntriesComponent } from './workrequestitem-attachrficontent-addentries.component';
import { WorkRequestItemSignupComponent } from './workrequestitem-signup.component';
import { WorkRequestItemCompleteModalComponent } from '../workrequest/workrequestitem-complete-modal.component';
import { WorkItemDeliverableCrudComponent, WorkItemDeliverableCrudWrapper } from '../workitemdeliverable/workitemdeliverable-crud.component';
import { StdMdbEntitystateComponent } from '@app/components/_global/std-mdb-entitystate/std-mdb-entitystate.component';

@Component({
  selector: 'app-workrequestitem-update',
  standalone: true,
  imports: [
    CommonModule, 
    WorkRequestItemCrudComponent,
    WorkRequestItemEnqueueRFIComponent,
    WorkRequestItemAttachRFIContentAddEntriesComponent,
    WorkRequestItemSignupComponent,
    WorkItemDeliverableCrudComponent,
    WorkRequestItemCompleteModalComponent,
    StdMdbEntitystateComponent
  ],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequestitem-update.component.html',
})
export class WorkRequestItemUpdateComponent extends AbstractEntityGroupComponent<WorkRequestItemCrudWrapper> implements OnInit, OnChanges {
  
  // Parent work request ID
  @Input() workRequestId!: string; 

  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<any> | null = null;
  protected override cdr = inject(ChangeDetectorRef);

  protected workItemDeliverableId: string = '';

  constructor() {
    super();
  }

  /**
   * Override ngOnInit to handle the case where this component is used as a child
   * with @Input() id instead of relying on route params
   */
  override ngOnInit(): void {
    this.currentUserProfileId = this.hcclContextService?.getCurrentUserProfileId() || '';
    
    // Load the entity directly using the input id, don't rely on route params
    if (this.id && this.id !== '') {
      this.loadEntity();
    }
  }

  /**
   * Handle input changes - reload entity when id changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      // id changed after initial load, reload the entity
      if (this.id && this.id !== '') {
        this.loadEntity();
      } else {
        // id is empty, reset the entity
        this.entity = null;
        this.loading = false;
      }
    }
  }

  /**
   * Load the entity by id
   */
  private loadEntity(): void {
    this.loading = true;
    this.loadEntityById(this.id).then(entity => {
      this.entity = entity;
      this.tabs = this.setupTabs();
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error loading WorkRequestItem:', error);
      this.loading = false;
      this.entity = null;
      this.cdr.detectChanges();
    });
  }

  protected newCrudWrapperForCreate(): WorkRequestItemCrudWrapper {
    return WorkRequestItemCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestItemCrudWrapper> {
    const workRequestItem = await WorkRequestItemCrudWrapper.newInstance(id, this.hcclService);
    
    // If the work request item is completed, load the work item deliverable
    if (workRequestItem.getData().currentStateCode === 'completed') {
      const workItemDeliverableCriteria: WorkItemDeliverableCriteria = {
        pageNumber: 1,
        pageSize: 50,
        isPaging: true,
        workRequestItemId: id
      };
      
      try {
        const workItemDeliverable = await WorkItemDeliverableCrudWrapper.newInstanceByCriteria(
          workItemDeliverableCriteria, 
          this.hcclService
        );
        this.workItemDeliverableId = workItemDeliverable.getData().id || '';
      } catch (error) {
        console.error('Error loading work item deliverable:', error);
        this.workItemDeliverableId = '';
      }
    }
    
    return workRequestItem;
  }

  protected setupTabs(): SimpleTab[] {
    // This component doesn't use tabs, return empty array
    return [];
  }

  /**
   * Override the refresh method to handle WorkRequestItem-specific refresh logic
   */
  protected override refreshComponent(): void {
    // Reset WorkRequestItem-specific state
    this.workItemDeliverableId = '';
    
    // Call parent refresh method
    super.refreshComponent();
    
    // Trigger change detection
    this.cdr.detectChanges();
  }

  // Get the action code for the work request item
  getWorkRequestItemActionCode(): string {
    return this.entity?.getData().actionCode || 'Error';
  }

  // Check if the work request item can be completed
  canChangeWorkItemStateToComplete(): boolean {
    return this.entity?.getCurrentStateCode() === 'inprocess';
  }

  // Open the complete work request item modal
  openCompleteWorkRequestItemModal(): void {
    const baseRoute = this.getBaseRoute();
    
    this.modalRef = this.modalService.open(WorkRequestItemCompleteModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.workRequestId,
        workRequestItemId: this.id,
        baseRoute: baseRoute
      }
    });
  }

  // Change the work request item state to complete
  changeWorkRequestItemStateToComplete(): void {
    const request: WorkItemFormRequest = {
      op: 'completeWorkItem',
      context: undefined,
      actionFormData: {
        someData: 'someData',
      }
    };
    const actionCode = this.entity?.getActionCode() || '';
    this.hcclService.callWorkRequestUi(this.workRequestId, actionCode, request).toPromise().then(rsp => {
      const wirsp: WorkItemFormResponse = rsp as WorkItemFormResponse;
      const wrid: string = wirsp.context?.workRequestItemId || '';
      this.closeModal();
    });
  }

  // Get the current state code
  getCurrentStateCode(): string {
    return this.entity?.getCurrentStateCode() || '';
  }

  // Check if action code matches
  isActionCode(actionCode: string): boolean {
    return this.entity?.getActionCode() === actionCode;
  }

  // Check if current state code matches
  isCurrentStateCode(stateCode: string): boolean {
    return this.entity?.getCurrentStateCode() === stateCode;
  }

  // Get work item deliverable ID
  getWorkItemDeliverableId(): string {
    return this.workItemDeliverableId;
  }

  // Check if deliverable exists
  hasWorkItemDeliverable(): boolean {
    return this.workItemDeliverableId !== '';
  }

  // Get the work request item entity
  getWorkRequestItem(): WorkRequestItemCrudWrapper | null {
    return this.entity;
  }
}

