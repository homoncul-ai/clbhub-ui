import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, WorkQueuePOSTData } from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '../../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { AvailableSelectorComponent } from '../../../components/_global/available-selector/available-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { WorkqueuetyperefCrudComponent } from '../../../components/_crud/workqueuetyperef/workqueuetyperef-crud.component';
import { CRUD_MODES } from '../../../@core/constants';

@Component({
  selector: 'app-create-queue-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent, 
    AvailableSelectorComponent, TranslateModule, WorkqueuetyperefCrudComponent],
  templateUrl: './create-queue-modal.component.html',
  styleUrls: ['./create-queue-modal.component.scss']
})
export class CreateQueueModalComponent implements OnInit, AfterViewInit {
  
  queueForm: FormGroup;
  isLoading = false;
  error: any = {};
  organizationId?: string;
  availableValue: number = 1;
  workQueueTypeIdValue: string = '';
  CRUD_MODES = CRUD_MODES;
  @ViewChild(WorkqueuetyperefCrudComponent) workQueueTypeRefComponent?: WorkqueuetyperefCrudComponent;

  constructor(
    public modalRef: MdbModalRef<CreateQueueModalComponent>,
    private formBuilder: FormBuilder,
    private hcclService: HcclService
  ) {
    this.queueForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      businessCode: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(1024)]],
      prefixCode: ['', [Validators.required, Validators.maxLength(50)]],
      workQueueTypeId: ['', [Validators.required]],
      workQueueTeamId: ['', [Validators.required]],
      available: [1, [Validators.required]],
      externalQueue: [1, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.queueForm.reset();
    
    // Get organizationId from modal data if provided
    if (this.modalRef && (this.modalRef as any).data) {
      this.organizationId = (this.modalRef as any).data.organizationId;
    }
    
    // Set default values
    this.queueForm.patchValue({
      available: 1,
      externalQueue: 1
    });
    
    // Sync available value with form
    this.availableValue = this.queueForm.get('available')?.value || 1;
    this.workQueueTypeIdValue = this.queueForm.get('workQueueTypeId')?.value || '';
  }
  
  ngAfterViewInit(): void {
    // Listen for changes to the work queue type selection
    // The component uses MenuControlDataListComponent internally which updates the id
    // We need to periodically check or use a different approach
    // For now, we'll read the value on form submit
  }
  
  onAvailableChange(value: number): void {
    this.availableValue = value;
    this.queueForm.patchValue({ available: value });
  }

  get formControls() {
    return this.queueForm.controls;
  }

  onSubmit(): void {
    // Get the selected work queue type ID from the component if available
    if (this.workQueueTypeRefComponent) {
      const selectedId = this.workQueueTypeRefComponent.id || this.workQueueTypeIdValue;
      if (selectedId) {
        this.queueForm.patchValue({ workQueueTypeId: selectedId });
      }
    }
    
    if (this.queueForm.valid) {
      this.isLoading = true;
      this.error = {};

      const formData = this.queueForm.value;
      const queueData: WorkQueuePOSTData = {
        name: formData.name,
        businessCode: formData.businessCode,
        description: formData.description,
        prefixCode: formData.prefixCode,
        workQueueTypeId: formData.workQueueTypeId || this.workQueueTypeIdValue,
        workQueueTeamId: formData.workQueueTeamId,
        available: formData.available || 1,
        organizationId: this.organizationId,
        externalQueue: formData.externalQueue || 1
      };
      
      this.hcclService.createWorkQueue(queueData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close(true); // Close with success
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Queue creation error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.modalRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.queueForm.controls).forEach(key => {
      const control = this.queueForm.get(key);
      control?.markAsTouched();
    });
  }
}

