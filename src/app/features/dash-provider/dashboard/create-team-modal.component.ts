import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, HcclTeamPOSTData } from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '../../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { AvailableSelectorComponent } from '../../../components/_global/available-selector/available-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { TeamTypeRefCrudComponent } from '../../../components/_crud/teamtyperef/teamtyperef-crud.component';
import { CRUD_MODES } from '../../../@core/constants';

@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent, 
    AvailableSelectorComponent, TranslateModule, TeamTypeRefCrudComponent],
  templateUrl: './create-team-modal.component.html',
  styleUrls: ['./create-team-modal.component.scss']
})
export class CreateTeamModalComponent implements OnInit, AfterViewInit {
  
  teamForm: FormGroup;
  isLoading = false;
  error: any = {};
  organizationId?: string;
  availableValue: number = 1;
  teamTypeIdValue: string = '';
  CRUD_MODES = CRUD_MODES;
  @ViewChild(TeamTypeRefCrudComponent) teamTypeRefComponent?: TeamTypeRefCrudComponent;

  constructor(
    public modalRef: MdbModalRef<CreateTeamModalComponent>,
    private formBuilder: FormBuilder,
    private hcclService: HcclService
  ) {
    this.teamForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      businessCode: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(1024)]],
      teamTypeId: ['', [Validators.required]],
      teamParentId: ['', [Validators.maxLength(255)]],
      teamParentEntityType: ['', [Validators.maxLength(255)]],
      teamParentName: ['', [Validators.maxLength(255)]],
      available: [1, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.teamForm.reset();
    
    // Get organizationId from modal data if provided
    if (this.modalRef && (this.modalRef as any).data) {
      this.organizationId = (this.modalRef as any).data.organizationId;
    }
    
    // Set default values
    this.teamForm.patchValue({
      available: 1
    });
    
    // Sync available value with form
    this.availableValue = this.teamForm.get('available')?.value || 1;
    this.teamTypeIdValue = this.teamForm.get('teamTypeId')?.value || '';
  }
  
  ngAfterViewInit(): void {
    // Listen for changes to the team type selection
    // The component uses MenuControlDataListComponent internally which updates the id
    // We need to periodically check or use a different approach
    // For now, we'll read the value on form submit
  }
  
  onAvailableChange(value: number): void {
    this.availableValue = value;
    this.teamForm.patchValue({ available: value });
  }

  get formControls() {
    return this.teamForm.controls;
  }

  onSubmit(): void {
    // Get the selected team type ID from the component if available
    if (this.teamTypeRefComponent) {
      const selectedId = this.teamTypeRefComponent.id || this.teamTypeIdValue;
      if (selectedId) {
        this.teamForm.patchValue({ teamTypeId: selectedId });
      }
    }
    
    if (this.teamForm.valid) {
      this.isLoading = true;
      this.error = {};

      const formData = this.teamForm.value;
      const teamData: HcclTeamPOSTData = {
        name: formData.name,
        businessCode: formData.businessCode,
        description: formData.description || undefined,
        teamTypeId: formData.teamTypeId || this.teamTypeIdValue,
        organizationId: this.organizationId,
        teamParentId: formData.teamParentId || undefined,
        teamParentEntityType: formData.teamParentEntityType || undefined,
        teamParentName: formData.teamParentName || undefined,
        available: formData.available || 1
      };
      
      this.hcclService.createHcclTeam(teamData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close(true); // Close with success
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Team creation error:', error);
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
    Object.keys(this.teamForm.controls).forEach(key => {
      const control = this.teamForm.get(key);
      control?.markAsTouched();
    });
  }
}

