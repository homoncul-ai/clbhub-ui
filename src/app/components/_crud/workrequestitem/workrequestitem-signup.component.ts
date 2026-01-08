import { CatalogEntryCriteria, CatalogSearchResultEntryCriteria, CatalogSearchResultGETData, CatalogSearchResultPOSTData, HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from './../../../restsvc/hccl.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { JsonPipe } from '@angular/common';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-workrequestitem-signup',
  standalone: true,
  imports: [CommonModule, WorkRequestItemCrudComponent, FormsModule,
     WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, FormsModule, MenuControlDataListComponent, JsonPipe,
    StdMdbFormTextComponent],

  templateUrl: './workrequestitem-signup.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestItemSignupComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {
  
  // Properties for the signup display
  protected studentName: string = '';
  protected courseName: string = '';
  protected studentNotes: string = '';

  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;

  override async ngOnInit(): Promise<void> {
    this.loading = true;

    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    if (this.childId != null) {
      this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(this.childId || '', this.hcclService);
    }

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

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
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

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }
} 

