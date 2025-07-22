import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '../../_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { WorkRequestItemGETData, WorkRequestItemPOSTData, WorkRequestItemPUTData, HcclService } from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '../../_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { SimpleMessagesSectionComponent } from '../../_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '../../_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '../../_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '../../_global/dategetdata-display/dategetdata-display.component';

@Component({
  selector: 'app-workrequestitem-crud',
  templateUrl: './workrequestitem-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class WorkRequestItemCrudComponent extends AbstractCrudComponent<WorkRequestItemCrudWrapper> implements OnInit, OnChanges {
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  // Abstract method implementations
  public newEmptyWrapper(): WorkRequestItemCrudWrapper {
    return WorkRequestItemCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestItemCrudWrapper> {
    const workRequestItemData = await this.hcclService.getWorkRequestItemById(id).toPromise();
    if (!workRequestItemData) {
      throw new Error('WorkRequestItem not found');
    }
    return new WorkRequestItemCrudWrapper(workRequestItemData, this.hcclService);
  }



  // Validation methods
  validateWorkRequestId(): boolean {
    const value = this.workRequestId;
    return Boolean(value && value.trim().length > 0);
  }

  validateNameText(): boolean {
    const value = this.nameText;
    return Boolean(value && value.trim().length > 0);
  }

  validateBusinessCode(): boolean {
    const value = this.businessCode;
    return Boolean(value && value.trim().length > 0);
  }

  validateSequenceOrder(): boolean {
    const value = this.sequenceOrder;
    return value !== null && value !== undefined && value >= 0;
  }

  validateDescription(): boolean {
    const value = this.description;
    return Boolean(value && value.trim().length > 0);
  }

  validateActionCode(): boolean {
    const value = this.actionCode;
    return Boolean(value && value.trim().length > 0);
  }

  validateCurrentStateCode(): boolean {
    const value = this.currentStateCode;
    return Boolean(value && value.trim().length > 0);
  }

  // CRUD operations
  protected override createEntityDataCall(): Promise<any> {
    const postData: WorkRequestItemPOSTData = {
      workRequestId: this.workRequestId,
      nameText: this.nameText,
      businessCode: this.businessCode,
      sequenceOrder: this.sequenceOrder,
      description: this.description,
      acceptedByUserId: this.acceptedByUserId || undefined,
      roleCode: this.roleCode || undefined,
      actionCode: this.actionCode,
      jsonData: this.jsonData || undefined,
      commentText: this.commentText || undefined,
      currentStateCode: this.currentStateCode,
      currentStateTransitionId: this.currentStateTransitionId || undefined
    };
    return this.hcclService.createWorkRequestItem(postData).toPromise();
  }

  protected override updateEntityDataCall(): Promise<any> {
    const putData: WorkRequestItemPUTData = {
      workRequestId: this.workRequestId,
      nameText: this.nameText,
      businessCode: this.businessCode,
      sequenceOrder: this.sequenceOrder,
      description: this.description,
      acceptedByUserId: this.acceptedByUserId || undefined,
      roleCode: this.roleCode || undefined,
      actionCode: this.actionCode,
      jsonData: this.jsonData || undefined,
      commentText: this.commentText || undefined,
      currentStateCode: this.currentStateCode,
      currentStateTransitionId: this.currentStateTransitionId || undefined
    };
    return this.hcclService.updateWorkRequestItemById(this.id!, putData).toPromise();
  }

  protected override deleteEntityData(id: string): Promise<boolean> {
    return this.hcclService.deleteWorkRequestItemById(id).toPromise().then(() => true);
  }

  // Getters and setters
  public get workRequestId(): string {
    return this.getCurrentEntity().getData().workRequestId || '';
  }

  public set workRequestId(value: string) {
    const data = this.getCurrentEntity();
    data.getData().workRequestId = value;
  }

  public get nameText(): string {
    return this.getCurrentEntity().getData().nameText || '';
  }

  public set nameText(value: string) {
    const data = this.getCurrentEntity();
    data.getData().nameText = value;
  }

  public get businessCode(): string {
    return this.getCurrentEntity().getData().businessCode || '';
  }

  public set businessCode(value: string) {
    const data = this.getCurrentEntity();
    data.getData().businessCode = value;
  }

  public get sequenceOrder(): number {
    return this.getCurrentEntity().getData().sequenceOrder || 0;
  }

  public set sequenceOrder(value: number) {
    const data = this.getCurrentEntity();
    data.getData().sequenceOrder = value;
  }

  public get description(): string {
    return this.getCurrentEntity().getData().description || '';
  }

  public set description(value: string) {
    const data = this.getCurrentEntity();
    data.getData().description = value;
  }

  public get acceptedByUserId(): string {
    return this.getCurrentEntity().getData().acceptedByUserId || '';
  }

  public set acceptedByUserId(value: string) {
    const data = this.getCurrentEntity();
    data.getData().acceptedByUserId = value;
  }

  public get roleCode(): string {
    return this.getCurrentEntity().getData().roleCode || '';
  }

  public set roleCode(value: string) {
    const data = this.getCurrentEntity();
    data.getData().roleCode = value;
  }

  public get actionCode(): string {
    return this.getCurrentEntity().getData().actionCode || '';
  }

  public set actionCode(value: string) {
    const data = this.getCurrentEntity();
    data.getData().actionCode = value;
  }

  public get jsonData(): string {
    return this.getCurrentEntity().getData().jsonData || '';
  }

  public set jsonData(value: string) {
    const data = this.getCurrentEntity();
    data.getData().jsonData = value;
  }

  public get commentText(): string {
    return this.getCurrentEntity().getData().commentText || '';
  }

  public set commentText(value: string) {
    const data = this.getCurrentEntity();
    data.getData().commentText = value;
  }

  public get currentStateCode(): string {
    return this.getCurrentEntity().getData().currentStateCode || '';
  }

  public set currentStateCode(value: string) {
    const data = this.getCurrentEntity();
    data.getData().currentStateCode = value;
  }

  public get currentStateTransitionId(): string {
    return this.getCurrentEntity().getData().currentStateTransitionId || '';
  }

  public set currentStateTransitionId(value: string) {
    const data = this.getCurrentEntity();
    data.getData().currentStateTransitionId = value;
  }



  // Display methods
  getWorkRequestId(): string {
    return this.getCurrentEntity().getData().workRequestId || '';
  }

  getNameText(): string {
    return this.getCurrentEntity().getData().nameText || '';
  }

  getBusinessCode(): string {
    return this.getCurrentEntity().getData().businessCode || '';
  }

  getSequenceOrder(): number {
    return this.getCurrentEntity().getData().sequenceOrder || 0;
  }

  getDescription(): string {
    return this.getCurrentEntity().getData().description || '';
  }

  getAcceptedByUserId(): string {
    return this.getCurrentEntity().getData().acceptedByUserId || '';
  }

  getRoleCode(): string {
    return this.getCurrentEntity().getData().roleCode || '';
  }

  getActionCode(): string {
    return this.getCurrentEntity().getData().actionCode || '';
  }

  getJsonData(): string {
    return this.getCurrentEntity().getData().jsonData || '';
  }

  getCommentText(): string {
    return this.getCurrentEntity().getData().commentText || '';
  }

  getCurrentStateCode(): string {
    return this.getCurrentEntity().getData().currentStateCode || '';
  }

  getCurrentStateTransitionId(): string {
    return this.getCurrentEntity().getData().currentStateTransitionId || '';
  }


}

export class WorkRequestItemCrudWrapper extends EntityWrapper<WorkRequestItemGETData> {
  static newInstanceForCreate(hcclService: HcclService): WorkRequestItemCrudWrapper {
    const workRequestItemData: WorkRequestItemGETData = {
      workRequestId: '',
      nameText: '',
      businessCode: '',
      sequenceOrder: 0,
      description: '',
      acceptedByUserId: '',
      roleCode: '',
      actionCode: '',
      jsonData: '',
      commentText: '',
      currentStateCode: '',
      currentStateTransitionId: ''
    };
    return new WorkRequestItemCrudWrapper(workRequestItemData, hcclService);
  }

  constructor(workRequestItemData: WorkRequestItemGETData, hcclService: HcclService) {
    super(workRequestItemData, hcclService);
  }

  override getDisplayText(): string {
    return this.data.nameText || this.data.businessCode || 'WorkRequestItem';
  }

  override getId(): string {
    return this.data.id || '';
  }

  override getHcclService(): HcclService {
    return this.hcclService!;
  }

  override getData(): WorkRequestItemGETData {
    return this.data;
  }

  override dump(): string {
    return JSON.stringify(this.data, null, 2);
  }
} 