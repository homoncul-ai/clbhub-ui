import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password-modal.component.html',
})
export class SetPasswordModalComponent {
  passwordForm: FormGroup;

  constructor(
    public modalRef: MdbModalRef<SetPasswordModalComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.maxLength(255)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.passwordsMatchValidator] },
    );
  }

  get passwordsMismatch(): boolean {
    const confirmPasswordControl = this.passwordForm.get('confirmPassword');
    return (
      this.passwordForm.hasError('passwordMismatch') &&
      confirmPasswordControl != null &&
      (confirmPasswordControl.dirty || confirmPasswordControl.touched)
    );
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
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

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
