import { CatalogEntryCriteria, CatalogSearchResultEntryCriteria, CatalogSearchResultGETData, CatalogSearchResultPOSTData, HcclUserContextGETData, MenuControlData, MenuControlDataList, SignupVerdictPOSTData, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from './../../../restsvc/hccl.service';
import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { JsonPipe } from '@angular/common';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';

@Component({
  selector: 'app-workrequestitem-signup',
  standalone: true,
  imports: [CommonModule, WorkRequestItemCrudComponent, FormsModule,
     WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, FormsModule, MenuControlDataListComponent, JsonPipe,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent, MdbRadioModule],

  templateUrl: './workrequestitem-signup.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestItemSignupComponent extends AbstractMultimodeComponent<WorkRequestItemCrudWrapper> implements OnInit  {
  

  // Properties for the signup display
  protected studentName: string = '';
  protected courseName: string = '';
  protected studentNotes: string = '';

  // Properties for verdict form
  protected verdictAccepted: boolean | null = null;
  protected verdictComments: string = '';
  protected isSaving: boolean = false;

  // Event emitter for when verdict is submitted
  @Output() verdictSubmitted = new EventEmitter<void>();

  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;

  override async ngOnInit(): Promise<void> {
    this.loading = true;

    this.entity = await WorkRequestItemCrudWrapper.newInstance(this.id, this.hcclService);
    this.workRequestItem = this.entity as WorkRequestItemCrudWrapper;



    var x : HcclUserContextGETData = this.hcclContextService.getContext();

    if (this.workItemFormContext.workRequestId === '') {
      this.workItemFormContext.workRequestId = this.id;
      this.workItemFormContext.workRequestItemId = this.childId;
      this.workItemFormContext.userProfileId = x.currentUserProfileId
      this.workItemFormContext.mapContextData = {};
      this.workItemFormContext.mapResultsData = {};
    }
    
    this.loading = false;
    this.localModes = ['signupView'];
    this.enterMode('signupView');
    super.ngOnInit();
  }

  protected workItemFormContext : WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };

  protected override async prepareModeEntry(entity: WorkRequestItemCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);

    if (mode === 'signupView') {
      await this.setupSignupView();
    }
    return Promise.resolve();
  }

  protected async setupSignupView() {
    var request : WorkItemFormRequest = {
      op: 'signupView',
      context: this.workItemFormContext,
      actionFormData: {}
    }
    this.workItemFormRequest = request;
    
    var rsp = await this.hcclService.callWorkRequestUi(this.id, 'Signup', request).toPromise();

    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    this.workItemFormResponse = wirsp;
    
    // Extract signup data from response
    this.studentName = wirsp.mapFormElements?.studentName || '';
    this.courseName = wirsp.mapFormElements?.courseName || '';
    this.studentNotes = wirsp.mapFormElements?.studentNotes || '';
    
    this.workItemFormContext = wirsp.context as WorkItemFormContext;
  }

  protected workItemFormResponse : WorkItemFormResponse | null = null;
  protected workItemFormRequest : WorkItemFormRequest | null = null;

  getStudentName(): string {
    return this.studentName;
  }

  getCourseName(): string {
    return this.courseName;
  }

  getStudentNotes(): string {
    return this.studentNotes;
  }

  isStateCompleted(): boolean {
    return this.workRequestItem?.getCurrentStateCode() === 'completed';
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestItemCrudWrapper> {
    return WorkRequestItemCrudWrapper.newInstance(id, this.hcclService);
  }

  // Verdict form methods
  setVerdictAccepted(accepted: boolean): void {
    this.verdictAccepted = accepted;
  }

  isVerdictFormValid(): boolean {
    return this.verdictAccepted !== null;
  }

  async submitVerdict(): Promise<void> {
    // Clear previous messages
    this.messages = {} as SimpleMessageList;

    this.isSaving = true;

    const verdictData: SignupVerdictPOSTData = {
      workRequestItemId: this.id,
      workRequestId: this.workRequestItem?.getData().workRequestId || '',
      verdictAccepted: this.verdictAccepted || false,
      comments: this.verdictComments,
    };

    try {
      const responseRaw = await this.hcclService.callVerdictSignupRequest(verdictData).toPromise();
      const response = responseRaw as WorkItemFormResponse;
      this.messages = response.messages || {} as SimpleMessageList;

      // Success - add success message
       
      // Reload the work request item to get updated state
      if (this.childId) {
        this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(this.workRequestItem?.getData().id || '', this.hcclService);
      }

      // Emit event to notify parent component
      this.verdictSubmitted.emit();

    } catch (error: any) {
      // Handle error
      const errorMessage = error?.message || error?.error?.message || 'An error occurred while submitting the verdict';
      this.addErrorMessage(errorMessage);
    } finally {
      this.isSaving = false;
    }
  }

  canSubmitVerdict(): boolean {
    return !this.isStateCompleted() && !this.isSaving;
  }
} 

