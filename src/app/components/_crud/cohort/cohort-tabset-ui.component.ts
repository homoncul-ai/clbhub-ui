import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CohortUIData,
  HcclService,
  HcclTeamMemberGETData,
  HcclUserProfileGETData,
  PMFileGroupGETData,
  PMFileGroupPOSTData,
} from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';
import { PmfilegroupUiComponent } from '@app/components/_crud/pmfilegroup-ui/pmfilegroup-ui.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CohortInviteModalComponent } from './cohort-invite-modal.component';

@Component({
  selector: 'app-cohort-tabset-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PMessageUiComponent, PmfilegroupUiComponent],
  template: `
    <div *ngIf="loading" class="cohort-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div class="cohort-ui" *ngIf="uiData && !loading">
      <div class="cohort-header">
        <div>
          <h2 class="cohort-name">{{ uiData.cohort?.name }}</h2>
          <span class="badge bg-secondary me-2">{{ uiData.cohort?.businessCode }}</span>
          <span class="badge bg-info">{{ uiData.cohort?.currentStateCode }}</span>
        </div>
      </div>

      <div *ngIf="inviteError" class="alert alert-danger py-2">{{ inviteError }}</div>
      <div *ngIf="inviteSuccess" class="alert alert-success py-2">{{ inviteSuccess }}</div>
      <div *ngIf="materialsError" class="alert alert-danger py-2">{{ materialsError }}</div>

      <div class="cohort-toolbar" *ngIf="canInvite">
        <button type="button" class="btn btn-sm btn-primary" (click)="openInviteModal()">
          <i class="fas fa-envelope me-2"></i>
          Invite User
        </button>
      </div>

      <app-simple-tabset
        [tabs]="tabs"
        [currentTabId]="currentTabId"
        (tabSelected)="selectTab($event)">
      </app-simple-tabset>

      <div class="cohort-tab-content">
        <div *ngIf="currentTabId === 'details'">
          <dl class="cohort-grid">
            <dt>Description</dt>
            <dd>{{ uiData.cohort?.description || '—' }}</dd>
            <dt>Organization</dt>
            <dd>{{ uiData.cohort?.organization?.entityDisplayName || '—' }}</dd>
            <dt>Date Created</dt>
            <dd>{{ uiData.cohort?.dateCreated?.formattedDate || '—' }}</dd>
          </dl>
        </div>

        <div *ngIf="currentTabId === 'members'">
          <div *ngIf="!uiData.members?.length" class="text-muted">No members yet.</div>
          <ul *ngIf="uiData.members?.length" class="list-group">
            <li *ngFor="let member of uiData.members" class="list-group-item">
              {{ member.messageHandle || member.userEmail || member.entityDisplayName }}
            </li>
          </ul>
        </div>

        <div *ngIf="currentTabId === 'invites' && canInvite">
          <div *ngIf="!uiData.outstandingInvites?.length" class="text-muted">No outstanding invitations.</div>
          <table *ngIf="uiData.outstandingInvites?.length" class="table table-sm">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let invite of uiData.outstandingInvites">
                <td>{{ invite.emailAddress }}</td>
                <td>{{ invite.currentStateCode }}</td>
                <td>{{ invite.dateExpires?.formattedDate || invite.dateExpires?.formattedDateTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="currentTabId === 'materials'">
          <div *ngIf="loadingFileGroup" class="text-center py-4">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-2 mb-0">Loading materials...</p>
          </div>

          <div *ngIf="!loadingFileGroup && creatingFileGroup" class="text-center py-5">
            <i class="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
            <p class="text-muted">Creating file group...</p>
          </div>

          <div *ngIf="!loadingFileGroup && !creatingFileGroup && !fileGroup" class="text-center py-5">
            <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <p class="text-muted" *ngIf="canManageMaterials">
              No file group is associated with this cohort.
            </p>
            <p class="text-muted" *ngIf="!canManageMaterials">
              No materials yet.
            </p>
            <button
              *ngIf="canManageMaterials"
              type="button"
              class="btn btn-primary"
              (click)="onCreateNewFileGroup()">
              <i class="fas fa-plus me-2"></i>Create New File Group
            </button>
          </div>

          <app-pmfilegroup-ui
            *ngIf="!loadingFileGroup && !creatingFileGroup && fileGroup"
            [data]="fileGroup"
            [readonly]="true">
          </app-pmfilegroup-ui>
        </div>

        <div *ngIf="currentTabId === 'messages'">
          <app-pmessage-ui *ngIf="getMessageId()" [id]="getMessageId()"></app-pmessage-ui>
          <div *ngIf="!getMessageId()" class="text-muted">No message channel configured.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cohort-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .cohort-header {
      margin-bottom: 1rem;
    }

    .cohort-name {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .cohort-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 0.5rem 1rem;
      margin: 0;
    }

    .cohort-grid dt {
      font-weight: 600;
      margin: 0;
    }

    .cohort-grid dd {
      margin: 0;
    }

    .cohort-tab-content {
      padding-top: 1rem;
    }

    .cohort-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }
  `],
})
export class CohortTabsetUiComponent implements OnChanges {
  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);

  @Input() id = '';
  /** When false, hide Invite User and the Invites tab (student view). */
  @Input() canInvite = true;
  /** When false, hide Create New File Group. True for SchoolProvider and Nonprofit admin on the org cohorts page. */
  @Input() canManageMaterials = true;

  loading = false;
  error = '';
  inviteError = '';
  inviteSuccess = '';
  materialsError = '';
  uiData: CohortUIData | null = null;
  currentTabId = 'details';

  fileGroup: PMFileGroupGETData | null = null;
  loadingFileGroup = false;
  creatingFileGroup = false;
  private fileGroupLoadedForId = '';

  tabs: SimpleTab[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['canInvite'] || changes['canManageMaterials'] || !this.tabs.length) {
      this.rebuildTabs();
    }

    if (changes['id']?.currentValue) {
      this.fileGroup = null;
      this.fileGroupLoadedForId = '';
      this.materialsError = '';
      this.loadCohort();
    }

    if (changes['canInvite'] && !this.canInvite && this.currentTabId === 'invites') {
      this.currentTabId = 'details';
    }
  }

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
    if (tabId === 'materials') {
      this.ensureFileGroupLoaded();
    }
  }

  getMessageId(): string {
    return this.uiData?.cohort?.messageId ?? '';
  }

  openInviteModal(): void {
    if (!this.canInvite) {
      return;
    }
    if (!this.id) {
      this.inviteError = 'Cohort is not loaded.';
      return;
    }

    this.inviteError = '';
    this.inviteSuccess = '';

    const modalRef = this.modalService.open(CohortInviteModalComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: { cohortId: this.id },
    });

    modalRef.onClose.subscribe((result: { invited?: boolean; email?: string; isNewUser?: boolean }) => {
      if (result?.invited) {
        this.inviteSuccess = result.isNewUser
          ? `Invitation sent to ${result.email}. They will be prompted to create an account before joining the cohort.`
          : `Invitation sent to ${result.email || 'the selected user'}.`;
        this.selectTab('invites');
        this.refreshUiData();
      }
    });
  }

  async onCreateNewFileGroup(): Promise<void> {
    if (!this.canManageMaterials || this.creatingFileGroup || !this.id) {
      return;
    }

    this.creatingFileGroup = true;
    this.materialsError = '';

    const cohortName = this.uiData?.cohort?.name || 'Cohort';
    const postData: PMFileGroupPOSTData = {
      parentEntityType: 'Cohort',
      parentEntityId: this.id,
      aspectCode: 'info',
      title: `${cohortName} Materials`,
      instructions: 'Cohort materials',
      available: true,
    };

    try {
      const createResponse = await this.hcclService.createPMFileGroup(postData).toPromise();
      if (!createResponse?.id) {
        this.materialsError = 'Failed to create file group: No ID returned.';
        return;
      }
      this.fileGroupLoadedForId = '';
      await this.loadFileGroupForCohort();
    } catch (error) {
      console.error('Error creating cohort file group:', error);
      this.materialsError = 'Error creating file group: ' + (error as Error).message;
    } finally {
      this.creatingFileGroup = false;
    }
  }

  reload(): void {
    if (this.id) {
      this.fileGroup = null;
      this.fileGroupLoadedForId = '';
      this.loadCohort();
    }
  }

  private rebuildTabs(): void {
    const tabs: SimpleTab[] = [
      new SimpleTab('details', 'Details', '', () => this.selectTab('details'), () => true),
      new SimpleTab('members', 'Members', '', () => this.selectTab('members'), () => true),
    ];

    if (this.canInvite) {
      tabs.push(new SimpleTab('invites', 'Invites', '', () => this.selectTab('invites'), () => true));
    }

    tabs.push(
      new SimpleTab('materials', 'Materials', '', () => this.selectTab('materials'), () => true),
      new SimpleTab('messages', 'Messages', '', () => this.selectTab('messages'), () => true),
    );

    this.tabs = tabs;
  }

  private ensureFileGroupLoaded(): void {
    if (!this.id || this.fileGroupLoadedForId === this.id || this.loadingFileGroup) {
      return;
    }
    this.loadFileGroupForCohort();
  }

  private async loadFileGroupForCohort(): Promise<void> {
    if (!this.id) {
      this.fileGroup = null;
      return;
    }

    this.loadingFileGroup = true;
    this.materialsError = '';

    try {
      const result = await this.hcclService.findPMFileGroups({
        parentEntityId: this.id,
        parentEntityType: 'Cohort',
        optionalDataHint: 'all',
      }).toPromise();

      if (result?.searchResults?.length) {
        this.fileGroup = result.searchResults[0];
      } else {
        this.fileGroup = null;
      }
      this.fileGroupLoadedForId = this.id;
    } catch (error) {
      console.warn(`Failed to load FileGroup for Cohort ${this.id}:`, error);
      this.fileGroup = null;
      this.materialsError = 'Unable to load materials for this cohort.';
    } finally {
      this.loadingFileGroup = false;
    }
  }

  private refreshUiData(): void {
    if (!this.id) {
      return;
    }
    this.hcclService.loadCohortUIData(this.id).subscribe({
      next: (data) => this.applyCohortUiData(data),
    });
  }

  private loadCohort(): void {
    this.loading = true;
    this.error = '';
    this.inviteSuccess = '';
    this.hcclService.loadCohortUIData(this.id).subscribe({
      next: (data) => {
        this.applyCohortUiData(data);
        this.loading = false;
        if (this.currentTabId === 'materials') {
          this.ensureFileGroupLoaded();
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load cohort details.';
      },
    });
  }

  private applyCohortUiData(data: CohortUIData): void {
    this.uiData = {
      ...data,
      members: data.members || [],
      outstandingInvites: data.outstandingInvites || [],
    };

    if (!data?.cohort) {
      const errors = data.messages?.messages?.filter((m) => m.severity === 1) || [];
      this.error = errors.map((e) => e.message).filter(Boolean).join(' ')
        || 'Failed to load cohort details.';
      return;
    }

    this.error = '';
    this.loadSupplementalLists();
  }

  private loadSupplementalLists(): void {
    if (!this.uiData?.cohort) {
      return;
    }

    const teamId = this.uiData.cohort.teamId;
    if (!this.uiData.members?.length && teamId) {
      this.hcclService.findHcclTeamMembers({
        teamId,
        pageNumber: 1,
        pageSize: 50,
        isPaging: true,
        optionalDataHint: 'all',
      }).subscribe({
        next: (results) => {
          if (!this.uiData) {
            return;
          }
          this.uiData = {
            ...this.uiData,
            members: (results.searchResults || []).map((member) => this.toMemberProfile(member)),
          };
        },
      });
    }

    if (this.canInvite && !this.uiData.outstandingInvites?.length && this.id) {
      this.hcclService.findHcclUserInvites({
        parentId: this.id,
        parentEntityType: 'Cohort',
        currentStateCode: 'initial',
        pageNumber: 1,
        pageSize: 50,
        isPaging: true,
        optionalDataHint: 'all',
      }).subscribe({
        next: (results) => {
          if (!this.uiData) {
            return;
          }
          this.uiData = {
            ...this.uiData,
            outstandingInvites: (results.searchResults || []).filter((invite) => invite.available !== 0),
          };
        },
      });
    }
  }

  private toMemberProfile(member: HcclTeamMemberGETData): HcclUserProfileGETData {
    if (member.userProfile) {
      return member.userProfile;
    }
    return {
      id: member.userProfileId,
      entityDisplayName: member.name || member.entityDisplayName,
    };
  }
}
