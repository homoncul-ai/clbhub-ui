import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclService,
  StudentDashUIGETData,
  WorkRequestCriteria,
  HcclUserInviteGETData,
  HcclUserInviteCriteria,
  HandleInviteActionPOSTData,
} from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclUserProfileCrudComponent } from './hccluserprofile-crud.component';
import { FamilyunitComponent } from './familyunit-component';
import { HcclOrganizationCrudComponent } from '../hcclorganization/hcclorganization-crud.component';
import { HcclTeamCrudComponent } from '../hcclteam/hcclteam-crud.component';
import { PMessageUiComponent } from '../pmessage-ui/pmessage-ui.component';
import { PersonalStatementCrudComponent } from '../personalstatement/personalstatement-crud.component';
import { WorkRequestListComponent } from '../workrequest/workrequest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-ui',
  templateUrl: './student-ui.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MdbAccordionModule,
    HcclUserProfileCrudComponent,
    FamilyunitComponent,
    HcclOrganizationCrudComponent,
    HcclTeamCrudComponent,
    PMessageUiComponent,
    PersonalStatementCrudComponent,
    WorkRequestListComponent,
  ],
})
export class StudentUiComponent implements OnInit, OnChanges {
  @Input() userProfileId!: string;

  dashData: StudentDashUIGETData | null = null;
  loading = false;
  error = '';
  openInvites: HcclUserInviteGETData[] = [];
  inviteActionError = '';
  processingInviteId: string | null = null;

  readonly CRUD_MODES = CRUD_MODES;

  /** Accordion state: which section is open. */
  accordionId = 'schoolTeam';

  private hcclService = inject(HcclService);
  private router = inject(Router);

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadOpenInvites();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfileId']) {
      this.loadData();
      this.loadOpenInvites();
    }
  }

  get hasOpenInvitations(): boolean {
    return this.openInvites.length > 0;
  }

  private loadData(): void {
    if (!this.userProfileId) {
      this.dashData = null;
      return;
    }
    this.loading = true;
    this.error = '';
    this.hcclService.resolveStudentDashData(this.userProfileId).subscribe({
      next: (data) => {
        this.dashData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load student data';
        this.loading = false;
      },
    });
  }

  private loadOpenInvites(): void {
    if (!this.userProfileId) {
      this.openInvites = [];
      return;
    }

    this.inviteActionError = '';
    this.hcclService.findHcclUserInvites(this.getOpenInviteCriteria()).subscribe({
      next: (results) => {
        this.openInvites = (results.searchResults || []).filter(invite => this.isOpenInvite(invite));
        if (this.hasOpenInvitations) {
          this.accordionId = 'invitations';
        }
      },
      error: () => {
        this.openInvites = [];
      },
    });
  }

  private getOpenInviteCriteria(): HcclUserInviteCriteria {
    return {
      inviteeId: this.userProfileId,
      currentStateCode: 'initial',
      optionalDataHint: 'all',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  private isOpenInvite(invite: HcclUserInviteGETData): boolean {
    if (invite.currentStateCode !== 'initial') {
      return false;
    }
    if (invite.available === 0) {
      return false;
    }
    const expiresMs = invite.dateExpires?.dateMilliseconds;
    if (expiresMs && expiresMs < Date.now()) {
      return false;
    }
    return true;
  }

  getInviteFrom(invite: HcclUserInviteGETData): string {
    const name =
      invite.createdByUserProfile?.entityDisplayName ||
      invite.createdByInfo?.name ||
      '';
    const org = invite.organization?.entityDisplayName;
    return org ? `${name} - [${org}]` : name;
  }

  getInviteType(invite: HcclUserInviteGETData): string {
    const code = invite.inviteCode || '';
    if (!code) {
      return '';
    }
    return code
      .replace(/^INVITE_/i, '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getInviteSubject(invite: HcclUserInviteGETData): string {
    return invite.notes || invite.parentName || invite.niceName || '';
  }

  getInviteExpires(invite: HcclUserInviteGETData): string {
    return (
      invite.dateExpires?.formattedDate ||
      invite.dateExpires?.formattedDateTime ||
      ''
    );
  }

  isInviteProcessing(invite: HcclUserInviteGETData): boolean {
    return !!invite.id && this.processingInviteId === invite.id;
  }

  handleInviteAction(invite: HcclUserInviteGETData, accepted: boolean): void {
    if (!invite.id || this.processingInviteId) {
      return;
    }

    this.processingInviteId = invite.id;
    this.inviteActionError = '';

    const postData: HandleInviteActionPOSTData = {
      inviteId: invite.id,
      notes: '',
      accepted,
    };

    this.hcclService.handleInviteAction(postData).subscribe({
      next: () => {
        this.processingInviteId = null;
        this.loadOpenInvites();
        if (accepted) {
          this.loadData();
        }
      },
      error: () => {
        this.processingInviteId = null;
        this.inviteActionError = 'Failed to process invitation. Please try again.';
      },
    });
  }

  getMyStudentTicketsCriteria(): WorkRequestCriteria {
    return {
      clientUserProfileId: this.userProfileId
    };
  }

  onClickWorkRequestRow(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    //x.alertMessage = 'Ticket';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      const segments = this.router.url.split('/').filter(Boolean);
      const dashboardBase = segments[0] || 'student-dashboard';
      return [dashboardBase, 'e', 'workrequest', id];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
}
