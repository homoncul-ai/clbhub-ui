import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import {
  CatalogEntryFeedProfilePOSTData,
  CatalogEntryFeedProfilePUTData,
  ConsentRequestGETData,
  HcclPersonGETData,
  HcclPersonPUTData,
  HcclService,
  MultiConsentRequestGETData,
  StudentProfileUIGETData,
} from '@app/restsvc/hccl.service';
import { DateGETData } from '@app/restsvc/common-request-service.model';
import { FamilyunitComponent } from '@app/components/_crud/hccluserprofile/familyunit-component';
import { StMdbAddrComponent } from '@app/components/_crud/st-mdb-addr/st-mdb-addr.component';
import { FeedInputsUiComponent } from '@app/components/_crud/entry_crud/feedinputs-ui/feedinputs-ui.component';
import { ContractViewerModalComponent } from '@app/components/_global/contract-section/contract-viewer-modal.component';

/** Consent list item from findAllContracts (includes dateSigned). */
type ProfileConsentItem = ConsentRequestGETData & {
  dateSigned?: DateGETData | null;
};

type StudentProfileWithConsents = StudentProfileUIGETData & {
  consents?: MultiConsentRequestGETData & { contracts?: ProfileConsentItem[] };
};

@Component({
  selector: 'app-student-profile-ui',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbAccordionModule,
    FamilyunitComponent,
    StMdbAddrComponent,
    FeedInputsUiComponent,
    ContractViewerModalComponent,
  ],
  templateUrl: './student-profile-ui.component.html',
  styleUrl: './student-profile-ui.component.scss',
})
export class StudentProfileUiComponent implements OnInit, OnChanges {
  @Input() id = '';

  protected hcclService = inject(HcclService);
  protected hcclContextService = inject(HcclContextService);

  accordionId = 'personal';
  loading = false;
  error = '';
  saveError = '';
  saveSuccess = '';
  saveaddress = '';
  saveaddressError = '';
  deletingAddress = false;
  saving = false;
  feedSaveError = '';
  feedSaveSuccess = '';
  feedSaving = false;

  private studentProfileUi: StudentProfileWithConsents = {};
  personDraft: HcclPersonGETData = {};
  private personSnapshot: HcclPersonGETData = {};
  activeConsent: ProfileConsentItem | null = null;

  useAddressForMatching = false;

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      this.loadProfile();
    }
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  get studentProfile(): StudentProfileWithConsents {
    return this.studentProfileUi;
  }

  get personalSectionTitle(): string {
    const first = (this.personDraft.firstName || '').trim();
    const last = (this.personDraft.lastName || '').trim();
    const fullName = [first, last].filter((part) => !!part).join(' ');
    return fullName ? `Personal Details for ${fullName}` : 'Personal Details';
  }

  get consents(): ProfileConsentItem[] {
    return this.studentProfileUi.consents?.contracts || [];
  }

  get hasConsents(): boolean {
    return this.consents.length > 0;
  }

  formatConsentDate(dateSigned?: DateGETData | null): string {
    if (!dateSigned) {
      return 'Not signed';
    }
    return dateSigned.formattedDateTime || dateSigned.formattedDate || 'Not signed';
  }

  openConsent(consent: ProfileConsentItem): void {
    this.activeConsent = consent;
  }

  closeConsent(): void {
    this.activeConsent = null;
  }

  get canSavePerson(): boolean {
    return !!this.personDraft.id && !!(this.personDraft.firstName || '').trim() && !!(this.personDraft.lastName || '').trim();
  }

  onSavePersonalDetails(): void {
    this.saveError = '';
    this.saveSuccess = '';

    if (!this.canSavePerson) {
      this.saveError = 'First name and last name are required.';
      return;
    }

    const personId = this.personDraft.id || '';
    const payload: HcclPersonPUTData = this.toPutPayload(this.personDraft);
    this.saving = true;

    this.hcclService.updateHcclPersonById(personId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.personSnapshot = this.clonePerson(this.personDraft);
        if (this.studentProfileUi.student?.theUser) {
          this.studentProfileUi.student.theUser.person = this.clonePerson(this.personDraft);
        }
        this.saveSuccess = 'Personal details updated.';
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err?.error?.message || err?.message || 'Unable to save personal details.';
      },
    });
  }

  onResetPersonalDetails(): void {
    this.personDraft = this.clonePerson(this.personSnapshot);
    this.saveError = '';
    this.saveSuccess = '';
  }

  onUseAddressForMatchingChange(value: boolean): void {
    this.useAddressForMatching = !!value;
    this.saveaddress = '';
    this.saveaddressError = '';
    if (!this.studentProfileUi.feedProfile) {
      this.studentProfileUi.feedProfile = {};
    }
    if (!this.studentProfileUi.feedProfile.feedInputs) {
      this.studentProfileUi.feedProfile.feedInputs = {};
    }
    this.studentProfileUi.feedProfile.feedInputs.usingLocation = this.useAddressForMatching;
  }

  onSaveFeedSettings(): void {
    const studentProfileId = this.studentProfileUi.student?.id || '';
    if (!studentProfileId) {
      this.feedSaveError = 'Student profile id is required before saving feed settings.';
      this.feedSaveSuccess = '';
      return;
    }

    const feedProfile = this.studentProfileUi.feedProfile || {};
    const feedInputs = feedProfile.feedInputs || {};
    feedInputs.usingLocation = this.useAddressForMatching;

    this.feedSaving = true;
    this.feedSaveError = '';
    this.feedSaveSuccess = '';

    if (feedProfile.id) {
      const putData: CatalogEntryFeedProfilePUTData = {
        userProfileId: feedProfile.userProfileId || studentProfileId,
        minScore: feedProfile.minScore ?? 0,
        maxDistanceInMiles: feedProfile.maxDistanceInMiles ?? 0,
        distanceInVocode: feedProfile.distanceInVocode ?? 0,
        feedProfileDataJson: feedProfile.feedProfileDataJson,
        getFeedProfileData: feedInputs,
      };
      this.hcclService.updateCatalogEntryFeedProfileById(feedProfile.id, putData).subscribe({
        next: () => {
          this.feedSaving = false;
          this.feedSaveSuccess = 'Feed settings saved.';
        },
        error: (err) => {
          this.feedSaving = false;
          this.feedSaveError = err?.error?.message || err?.message || 'Unable to save feed settings.';
        },
      });
      return;
    }

    const postData: CatalogEntryFeedProfilePOSTData = {
      userProfileId: studentProfileId,
      minScore: feedProfile.minScore ?? 0,
      maxDistanceInMiles: feedProfile.maxDistanceInMiles ?? 0,
      distanceInVocode: feedProfile.distanceInVocode ?? 0,
      feedProfileDataJson: feedProfile.feedProfileDataJson,
      getFeedProfileData: feedInputs,
    };
    this.hcclService.createCatalogEntryFeedProfile(postData).subscribe({
      next: (response: any) => {
        this.feedSaving = false;
        if (!this.studentProfileUi.feedProfile) {
          this.studentProfileUi.feedProfile = {};
        }
        const createdId =
          response?.id || response?.catalogEntryFeedProfileId || response?.entityId || response?.data?.id || null;
        if (createdId) {
          this.studentProfileUi.feedProfile.id = createdId;
        }
        this.studentProfileUi.feedProfile.userProfileId = studentProfileId;
        this.studentProfileUi.feedProfile.feedInputs = feedInputs;
        this.feedSaveSuccess = 'Feed settings saved.';
      },
      error: (err) => {
        this.feedSaving = false;
        this.feedSaveError = err?.error?.message || err?.message || 'Unable to save feed settings.';
      },
    });
  }

  onAddressCreated(addressId: string): void {
    if (!addressId) {
      return;
    }

    this.personDraft.hcclAddrId = addressId;
    this.saveaddress = '';
    this.saveaddressError = '';
    
    const personId = this.personDraft.id || '';
    if (!personId) {
      this.saveaddressError = 'Address was created, but person id is missing so address link could not be saved.';
      return;
    }

    const payload: HcclPersonPUTData = this.toPutPayload(this.personDraft);
    this.saving = true;
    this.hcclService.updateHcclPersonById(personId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.useAddressForMatching = true;
        if (!this.studentProfileUi.feedProfile) {
          this.studentProfileUi.feedProfile = {};
        }
        if (!this.studentProfileUi.feedProfile.feedInputs) {
          this.studentProfileUi.feedProfile.feedInputs = {};
        }
        this.studentProfileUi.feedProfile.feedInputs.usingLocation = true;
        this.personSnapshot = this.clonePerson(this.personDraft);
        if (this.studentProfileUi.student?.theUser) {
          this.studentProfileUi.student.theUser.person = this.clonePerson(this.personDraft);
        }
        this.saveaddress = 'Address was created and linked to your profile.';
      },
      error: (err) => {
        this.saving = false;
        this.saveaddressError =
          err?.error?.message || err?.message || 'Address was created, but linking it to your profile failed.';
      },
    });
  }

  onDeleteMyAddress(): void {
    const addressId = (this.personDraft.hcclAddrId || '').trim();
    const personId = (this.personDraft.id || '').trim();

    this.saveaddress = '';
    this.saveaddressError = '';

    if (!addressId) {
      return;
    }
    if (!personId) {
      this.saveaddressError = 'Person id is missing so address deletion could not be completed.';
      return;
    }

    this.deletingAddress = true;
    this.hcclService.deleteHcclAddrById(addressId).subscribe({
      next: () => {
        this.personDraft.hcclAddrId = undefined;
        const payload: HcclPersonPUTData = this.toPutPayload(this.personDraft);
        (payload as any).hcclAddrId = null;
        this.hcclService.updateHcclPersonById(personId, payload).subscribe({
          next: () => {
            this.deletingAddress = false;
            this.useAddressForMatching = false;
            if (!this.studentProfileUi.feedProfile) {
              this.studentProfileUi.feedProfile = {};
            }
            if (!this.studentProfileUi.feedProfile.feedInputs) {
              this.studentProfileUi.feedProfile.feedInputs = {};
            }
            this.studentProfileUi.feedProfile.feedInputs.usingLocation = false;
            this.personSnapshot = this.clonePerson(this.personDraft);
            if (this.studentProfileUi.student?.theUser) {
              this.studentProfileUi.student.theUser.person = this.clonePerson(this.personDraft);
            }
            this.saveaddress = 'Address deleted and removed from your profile.';
          },
          error: (err) => {
            this.deletingAddress = false;
            this.saveaddressError =
              err?.error?.message || err?.message || 'Address was deleted, but removing it from your profile failed.';
          },
        });
      },
      error: (err) => {
        this.deletingAddress = false;
        this.saveaddressError = err?.error?.message || err?.message || 'Unable to delete your address.';
      },
    });
  }

  private loadProfile(): void {
    const explicitId = (this.id || '').trim();
    if (explicitId) {
      this.loadProfileById(explicitId);
      return;
    }

    this.loading = true;
    this.error = '';
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        const contextId = context?.currentUserProfileId || '';
        if (!contextId) {
          this.loading = false;
          this.error = 'Student profile id is required.';
          this.studentProfileUi = {};
          this.personDraft = {};
          this.personSnapshot = {};
          return;
        }
        this.loadProfileById(contextId);
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to resolve student context.';
      },
    });
  }

  private loadProfileById(resolvedId: string): void {
    this.loading = true;
    this.error = '';
    this.saveError = '';
    this.saveSuccess = '';
    this.saveaddress = '';
    this.saveaddressError = '';
    this.feedSaveError = '';
    this.feedSaveSuccess = '';

    this.hcclService.resolveStudentProfileData(resolvedId).subscribe({
      next: (data) => {
        this.loading = false;
        this.studentProfileUi = (data || {}) as StudentProfileWithConsents;
        this.activeConsent = null;
        const person = data?.student?.theUser?.person || {};
        this.personDraft = this.clonePerson(person);
        this.personSnapshot = this.clonePerson(person);

        const usingLocation = data?.feedProfile?.feedInputs?.usingLocation;
        this.useAddressForMatching = usingLocation === undefined ? !!person?.hcclAddrId : !!usingLocation;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Unable to load student profile data.';
      },
    });
  }

  private toPutPayload(person: HcclPersonGETData): HcclPersonPUTData {
    const firstName = (person.firstName || '').trim();
    const lastName = (person.lastName || '').trim();
    return {
      organizationId: person.organizationId,
      name: [firstName, lastName].filter((part) => !!part).join(' ') || person.name || '',
      businessCode: person.businessCode || 'student',
      available: person.available ?? 1,
      dataOriginCode: person.dataOriginCode,
      userProfileId: person.userProfileId,
      userId: person.userId,
      userEmail: person.userEmail,
      cellPhoneNumber: person.cellPhoneNumber,
      workPhoneNumber: person.workPhoneNumber,
      firstName,
      lastName,
      messageHandle: person.messageHandle || '',
      languageCode: person.languageCode || 'en',
      hcclAddrId: person.hcclAddrId,
      monthBorn: person.monthBorn,
      yearBorn: person.yearBorn ?? 2000,
    };
  }

  private clonePerson(person: HcclPersonGETData): HcclPersonGETData {
    return JSON.parse(JSON.stringify(person || {})) as HcclPersonGETData;
  }
}
