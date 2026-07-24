import { Component } from '@angular/core';
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
export interface SetPasswordModalResult {
  newPassword: string;
}

/**
 * Collects a new password (with confirmation) for the admin "Set Password"
 * action. Returns the password to the caller via `modalRef.close()`; the caller
 * is responsible for invoking `manageUserAction`.
 */
@Component({
  selector: 'app-set-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent],
  templateUrl: './set-password-modal.component.html',
})
export class SetPasswordModalComponent {
  passwordForm: FormGroup;
  error: any = {};

  constructor(
    public modalRef: MdbModalRef<SetPasswordModalComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get passwordsMatch(): boolean {
    const { password, confirmPassword } = this.passwordForm.value;
    return !!password && password === confirmPassword;
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.passwordsMatch) {
      const result: SetPasswordModalResult = {
        newPassword: this.passwordForm.value.password,
      };
      this.modalRef.close(result);
    } else {
      Object.keys(this.passwordForm.controls).forEach((key) =>
        this.passwordForm.get(key)?.markAsTouched(),
      );
    }
  }

  onCancel(): void {
    this.modalRef.close(null);
  }
}
