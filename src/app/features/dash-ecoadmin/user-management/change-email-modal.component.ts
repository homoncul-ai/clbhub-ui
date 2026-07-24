import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';

/**
 * Result emitted on successful submit.
 */
export interface ChangeEmailModalResult {
  updatedEmailAddress: string;
}

/**
 * Collects a new email address for the "Change Email" action. The current email
 * can be passed in via modal data (`currentEmail`) to prefill the field.
 */
@Component({
  selector: 'app-change-email-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent],
  templateUrl: './change-email-modal.component.html',
})
export class ChangeEmailModalComponent implements OnInit {
  emailForm: FormGroup;
  error: any = {};
  currentEmail = '';

  constructor(
    public modalRef: MdbModalRef<ChangeEmailModalComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.emailForm = this.formBuilder.group({
      updatedEmailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    if (this.modalRef && (this.modalRef as any).data) {
      this.currentEmail = (this.modalRef as any).data.currentEmail || '';
      if (this.currentEmail) {
        this.emailForm.patchValue({ updatedEmailAddress: this.currentEmail });
      }
    }
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      const result: ChangeEmailModalResult = {
        updatedEmailAddress: this.emailForm.value.updatedEmailAddress,
      };
      this.modalRef.close(result);
    } else {
      this.emailForm.get('updatedEmailAddress')?.markAsTouched();
    }
  }

  onCancel(): void {
    this.modalRef.close(null);
  }
}
