import { HcclOrgSetupData, MenuControlDataList, HcclUserProfileCriteria, HcclUserProfileGETData } from '@app/restsvc/hccl.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, OnboardOrgUserPOSTData } from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbPhoneComponent } from '../../../components/_global/std-mdb-phone/std-mdb-phone.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-onboard-org-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
    StdMdbFormTextComponent, StdMdbPhoneComponent, TranslateModule, MenuControlDataListComponent],
  templateUrl: './onboard-org-user-modal.component.html',
  styleUrls: ['./onboard-org-user-modal.component.scss']
})
export class OnboardOrgUserModalComponent implements OnInit {
  
  onboardForm: FormGroup;
  isLoading = false;
  error: any = {};
  organizationId?: string;
  
  // Validation states
  checkingEmail = false;
  checkingUserName = false;
  emailExists: HcclUserProfileGETData | null = null;
  userNameExists: HcclUserProfileGETData | null = null;
  validationErrors: { email?: string; userName?: string } = {};
  
  // Debounce subjects for validation
  private emailCheckSubject = new Subject<string>();
  private userNameCheckSubject = new Subject<string>();

  constructor(
    public modalRef: MdbModalRef<OnboardOrgUserModalComponent>,
    private formBuilder: FormBuilder,
    private hcclService: HcclService
  ) {
    this.onboardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      userName: ['', [Validators.required, Validators.maxLength(255)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      workPhone: ['', [Validators.maxLength(255)]],
      cellPhone: ['', [Validators.maxLength(255)]],
      profileTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      roles: [[]]
    });
    
    // Setup debounced validation
    this.setupEmailValidation();
    this.setupUserNameValidation();
  }
  
  private setupEmailValidation(): void {
    this.emailCheckSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((email: string) => {
        this.checkingEmail = true;
        this.emailExists = null;
        this.validationErrors.email = undefined;
        return this.hcclService.findHcclUserProfiles({
          userEmail: email,
          pageSize: 1,
          isPaging: true
        });
      })
    ).subscribe({
      next: (response) => {
        this.checkingEmail = false;
        if (response.searchResults && response.searchResults.length > 0) {
          this.emailExists = response.searchResults[0];
          this.validationErrors.email = `A user with this email already exists.`;
        } else {
          this.emailExists = null;
          this.validationErrors.email = undefined;
        }
      },
      error: (error) => {
        this.checkingEmail = false;
        console.error('Error checking email:', error);
      }
    });
  }
  
  private setupUserNameValidation(): void {
    this.userNameCheckSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((userName: string) => {
        this.checkingUserName = true;
        this.userNameExists = null;
        this.validationErrors.userName = undefined;
        // Capture userName in closure for use in the find callback
        const searchUserName = userName;
        return this.hcclService.findHcclUserProfiles({
          searchByText: searchUserName,
          userCode: searchUserName, // Also check userCode field
          pageSize: 10,
          isPaging: true
        });
      })
    ).subscribe({
      next: (response) => {
        this.checkingUserName = false;
        if (response.searchResults && response.searchResults.length > 0) {
          // Get the userName from the form to compare
          const currentUserName = this.onboardForm.get('userName')?.value;
          if (currentUserName) {
            // Check if any result matches the userName (could be in userCode or theUser.name)
            const matchingUser = response.searchResults.find(profile => 
              profile.userCode === currentUserName || 
              profile.theUser?.name === currentUserName
            );
            if (matchingUser) {
              this.userNameExists = matchingUser;
              this.validationErrors.userName = `A user with this username already exists.`;
            } else {
              this.userNameExists = null;
              this.validationErrors.userName = undefined;
            }
          } else {
            this.userNameExists = null;
            this.validationErrors.userName = undefined;
          }
        } else {
          this.userNameExists = null;
          this.validationErrors.userName = undefined;
        }
      },
      error: (error) => {
        this.checkingUserName = false;
        console.error('Error checking username:', error);
      }
    });
  }

  ngOnInit(): void {
    this.onboardForm.reset();
    this.isLoading = true;
    
    // Get organizationId from modal data if not already set
    if (this.modalRef && (this.modalRef as any).data) {
      this.organizationId = (this.modalRef as any).data.organizationId || this.organizationId;
    }
    
    // Load the dropdown info 
    if (this.organizationId) {
      this.loadOrgSetupData(this.organizationId);
    } else {
      // If no organizationId, still set loading to false to show form
      // (though this shouldn't happen in normal flow)
      this.isLoading = false;
      console.warn('Organization ID not provided');
    }
  }

  loadOrgSetupData(organizationId: string): void {
    var userId = "00000000-0000-0000-0000-000000000000"

    this.hcclService.getOrgSetupData(organizationId, userId)
    .subscribe({
      next: (osData) => {
        this.orgSetupData = osData;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading organization setup data:', error);
      }
    });
  }
  
  orgSetupData: HcclOrgSetupData = {
    profileTypeMenu: {
      menuItems: []
    } as MenuControlDataList
  };


  get formControls() {
    return this.onboardForm.controls;
  }

  onSubmit(): void {
    // Check for validation errors (duplicate email or username)
    if (this.hasValidationErrors()) {
      return; // Don't submit if there are duplicate validation errors
    }
    
    if (this.onboardForm.valid) {
      this.isLoading = true;
      this.error = {};

      const formData = this.onboardForm.value;
      const onboardData: OnboardOrgUserPOSTData = {
        organizationCode: this.organizationId || '',
        messageHandle: formData.name,
        userName: formData.userName,
        emailAddress: formData.emailAddress,
        cellPhone: formData.cellPhone || undefined,
        profileTypeCode: formData.profileTypeCode,
        roles: formData.roles || []
      };
      this.hcclService.onboardOrgUser(onboardData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close(true); // Close with success
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Onboarding error:', error);
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
    Object.keys(this.onboardForm.controls).forEach(key => {
      const control = this.onboardForm.get(key);
      control?.markAsTouched();
    });
  }
  
  /**
   * Check email address on blur
   */
  checkEmailAddress(): void {
    const email = this.onboardForm.get('emailAddress')?.value;
    const emailControl = this.onboardForm.get('emailAddress');
    
    if (!email) {
      this.checkingEmail = false;
      this.emailExists = null;
      this.validationErrors.email = undefined;
      return;
    }
    
    // First check if email format is valid
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      this.checkingEmail = false;
      this.emailExists = null;
      this.validationErrors.email = 'Please enter a valid email address format.';
      return;
    }
    
    // If email is valid and username is empty, set username to email
    const userNameControl = this.onboardForm.get('userName');
    const userName = userNameControl?.value;
    if (!userName || userName.trim() === '') {
      userNameControl?.setValue(email);
    }
    
    // If name is empty and email equals username, try to guess name from email
    const nameControl = this.onboardForm.get('name');
    const name = nameControl?.value;
    const currentUserName = userNameControl?.value || email;
    
    if ((!name || name.trim() === '') && email === currentUserName) {
      const guessedName = this.guessNameFromEmail(email);
      if (guessedName) {
        nameControl?.setValue(guessedName);
      }
    }
    
    // If format is valid, check for duplicates via API
    if (emailControl?.valid) {
      this.emailCheckSubject.next(email);
    } else {
      this.checkingEmail = false;
      this.emailExists = null;
      this.validationErrors.email = undefined;
    }
  }
  
  /**
   * Guess a name from an email address
   * Handles formats like: firstname.lastname, firstname_lastname, firstname-lastname, firstnamelastname, etc.
   */
  private guessNameFromEmail(email: string): string | null {
    if (!email || !email.includes('@')) {
      return null;
    }
    
    // Extract the part before @
    const localPart = email.split('@')[0];
    if (!localPart) {
      return null;
    }
    
    // Try different separators: ., _, -, or camelCase
    let nameParts: string[] = [];
    
    // Check for common separators
    if (localPart.includes('.')) {
      nameParts = localPart.split('.');
    } else if (localPart.includes('_')) {
      nameParts = localPart.split('_');
    } else if (localPart.includes('-')) {
      nameParts = localPart.split('-');
    } else {
      // Try to detect camelCase (e.g., johnDoe -> ["john", "Doe"])
      const camelCaseMatch = localPart.match(/^([a-z]+)([A-Z][a-z]*)+$/);
      if (camelCaseMatch) {
        // Split camelCase: find where lowercase ends and uppercase begins
        const parts = localPart.match(/[a-z]+|[A-Z][a-z]*/g);
        if (parts && parts.length >= 2) {
          nameParts = parts;
        } else {
          // If no clear pattern, just capitalize the whole thing
          nameParts = [localPart];
        }
      } else {
        // No clear pattern, just use the whole local part
        nameParts = [localPart];
      }
    }
    
    // Capitalize each part and join with space
    if (nameParts.length > 0) {
      const capitalizedParts = nameParts
        .filter(part => part.length > 0)
        .map(part => {
          // Capitalize first letter, lowercase the rest
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        });
      
      if (capitalizedParts.length > 0) {
        return capitalizedParts.join(' ');
      }
    }
    
    return null;
  }
  
  /**
   * Check username on blur
   */
  checkUserName(): void {
    const userName = this.onboardForm.get('userName')?.value;
    if (userName && this.onboardForm.get('userName')?.valid) {
      this.userNameCheckSubject.next(userName);
    } else {
      this.checkingUserName = false;
      this.userNameExists = null;
      this.validationErrors.userName = undefined;
    }
  }
  
  /**
   * Navigate to existing user profile
   * This method will be implemented later to handle navigation
   */
  navigateToUser(userProfileId: string): void {
    // TODO: Implement navigation to user profile
    console.log('Navigate to user profile:', userProfileId);
    // Example: this.router.navigate(['/path/to/user', userProfileId]);
  }
  
  /**
   * Check if there are any validation errors
   */
  hasValidationErrors(): boolean {
    return !!(this.validationErrors.email || this.validationErrors.userName);
  }
}
