import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { firstValueFrom } from 'rxjs';
import { LadderSelectorComponent } from '@app/components/_global/ladder-selector/ladder-selector.component';
import { HcclUserProfileSelectorComponent } from '@app/components/_global/hccl-user-profile-selector/hccl-user-profile-selector.component';
import { PmfilegroupUiComponent } from '@app/components/_crud/pmfilegroup-ui/pmfilegroup-ui.component';
import {
  CohortPOSTData,
  CohortPursuitPOSTData,
  HcclService,
  HcclTeamMemberPOSTData,
  HcclTeamMemberRolePOSTData,
  HcclUserProfileCriteria,
  HcclUserProfileGETData,
  PMFileGroupGETData,
  PMFileGroupPOSTData,
} from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { GlobalConstants } from '@app/global-constants';
import { CareerLadder } from '@app/shared/data/career-ladders';

@Component({
  selector: 'app-cohort-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbFormsModule,
    LadderSelectorComponent,
    HcclUserProfileSelectorComponent,
    PmfilegroupUiComponent,
  ],
  templateUrl: './cohort-create-modal.component.html',
  styleUrl: './cohort-create-modal.component.scss',
})
export class CohortCreateModalComponent implements OnInit {
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  currentPage = 1;
  readonly totalPages = 3;

  selectedLadder: CareerLadder | null = null;
  selectedLadderIds: string[] = [];
  private autoNameFromPursuit = '';

  /** No practical cap on co-leaders (HCCL-74). */
  readonly leaderMaxAllowed = 0;
  leaderCriteria: HcclUserProfileCriteria = {};
  lockedLeaderIds: string[] = [];
  selectedLeaderIds: string[] = [];
  initialLeaders: HcclUserProfileGETData[] = [];
  selectedLeaders: HcclUserProfileGETData[] = [];

  name = '';
  businessCode = '';
  mission = '';

  cohortId = '';
  fileGroup: PMFileGroupGETData | null = null;
  loadingFileGroup = false;
  creatingFileGroup = false;

  saving = false;
  error = '';

  constructor(public modalRef: MdbModalRef<CohortCreateModalComponent>) {}

  ngOnInit(): void {
    void this.initLeaders();
  }

  private async initLeaders(): Promise<void> {
    const context = this.hcclContextService.getContext();
    const profile = context?.currentUserProfile;
    const profileId = context?.currentUserProfileId || profile?.id || '';
    // For now: all citizens (no org filter). Ticket later: advisors in the provider org.
    // Org filter hid people like sam.houser (student at another school).
    this.leaderCriteria = {
      pageNumber: 1,
      pageSize: 20,
      isPaging: true,
    };

    if (!profileId) {
      return;
    }

    this.lockedLeaderIds = [profileId];
    this.selectedLeaderIds = [profileId];

    let lockedProfile: HcclUserProfileGETData = {
      ...(profile || {}),
      id: profileId,
    };

    try {
      const results = await firstValueFrom(
        this.hcclService.findHcclUserProfiles({
          ids: [profileId],
          optionalDataHint: 'all',
          pageNumber: 1,
          pageSize: 1,
          isPaging: true,
        }),
      );
      const found = results?.searchResults?.[0];
      if (found) {
        lockedProfile = found;
      }
    } catch {
      // Context profile is enough for the locked chip label.
    }

    this.initialLeaders = [lockedProfile];
    this.selectedLeaders = [lockedProfile];
  }

  onLadderSelectionChange(ladders: CareerLadder[]): void {
    this.selectedLadder = ladders[0] || null;
    this.selectedLadderIds = this.selectedLadder ? [this.selectedLadder.id] : [];

    if (!this.selectedLadder) {
      if (this.name === this.autoNameFromPursuit) {
        this.name = '';
      }
      this.autoNameFromPursuit = '';
      return;
    }

    const nextAutoName = `Exploring : ${this.selectedLadder.name}`;
    if (!this.name.trim() || this.name === this.autoNameFromPursuit) {
      this.name = nextAutoName;
    }
    this.autoNameFromPursuit = nextAutoName;
  }

  onLeaderSelectionChange(profiles: HcclUserProfileGETData[]): void {
    this.selectedLeaders = profiles || [];
    this.selectedLeaderIds = this.selectedLeaders.map((p) => p.id!).filter(Boolean);
  }

  nextPage(): void {
    this.error = '';
    if (this.currentPage === 1 && !this.selectedLadder) {
      this.error = 'Select one pursuit to continue.';
      return;
    }
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  prevPage(): void {
    this.error = '';
    if (this.currentPage === 2 && !this.cohortId) {
      this.currentPage = 1;
    }
  }

  goToMaterialsPage(): void {
    this.currentPage = 3;
    void this.ensureFileGroup();
  }

  async createCohortAndPursuit(): Promise<void> {
    this.error = '';
    if (!this.selectedLadder) {
      this.error = 'Select a pursuit on page 1 first.';
      return;
    }
    if (!this.name.trim() || !this.businessCode.trim()) {
      this.error = 'Name and business code are required.';
      return;
    }

    const context = this.hcclContextService.getContext();
    const creatorProfileId = context?.currentUserProfileId || context?.currentUserProfile?.id || '';
    const missionText = (this.mission || this.name).trim();
    const postData: CohortPOSTData = {
      name: this.name.trim(),
      businessCode: this.businessCode.trim(),
      description: missionText,
      mdMissionStatement: this.mission.trim() || undefined,
      organizationId: context?.currentUserProfile?.organizationId,
      available: 1,
      teamId: GlobalConstants.UUID_SENTINEL,
      currentStateCode: 'initial',
    };

    this.saving = true;
    try {
      const createResponse = await firstValueFrom(this.hcclService.createCohort(postData));
      const cohortId = createResponse?.id;
      if (!cohortId) {
        this.error = 'Cohort was created but no id was returned.';
        return;
      }
      this.cohortId = cohortId;

      const pursuitName = this.selectedLadder.name;
      let ladderId: string | undefined;
      try {
        const ladderResults = await firstValueFrom(
          this.hcclService.findCareerLadderRefs({
            businessCode: this.selectedLadder.id,
            pageNumber: 1,
            pageSize: 5,
            isPaging: true,
          }),
        );
        ladderId =
          ladderResults?.searchResults?.find((r) => r.businessCode === this.selectedLadder!.id)?.id ||
          ladderResults?.searchResults?.[0]?.id;

        if (!ladderId) {
          const byName = await firstValueFrom(
            this.hcclService.findCareerLadderRefs({
              name: pursuitName,
              pageNumber: 1,
              pageSize: 5,
              isPaging: true,
            }),
          );
          ladderId = byName?.searchResults?.[0]?.id;
        }
      } catch {
        // Pursuit can still be created without a resolved ladder UUID.
      }

      try {
        const pursuitBody: CohortPursuitPOSTData = {
          name: pursuitName,
          cohortId,
          ladderId,
          pursuitTypeCode: 'Ladder',
          rawText: pursuitName,
          encodingText: pursuitName,
          status: 1,
        };
        await firstValueFrom(this.hcclService.createCohortPursuit(pursuitBody));
      } catch {
        this.error =
          'Cohort was created, but linking the pursuit failed. You can finish and continue on the cohort page.';
      }

      const extraLeaders = this.selectedLeaders.filter(
        (p) => p.id && p.id !== creatorProfileId,
      );
      if (extraLeaders.length) {
        try {
          await this.addExtraLeaders(cohortId, extraLeaders);
        } catch {
          this.error = this.error
            ? `${this.error} Some co-leaders could not be added.`
            : 'Cohort was created, but some co-leaders could not be added. You can finish and continue on the cohort page.';
        }
      }

      this.currentPage = 3;
      await this.ensureFileGroup();
    } catch {
      this.error = this.cohortId
        ? 'Cohort was created, but setup did not finish completely. You can finish and continue on the cohort page.'
        : 'Failed to create cohort.';
      if (this.cohortId) {
        this.currentPage = 3;
        await this.ensureFileGroup();
      }
    } finally {
      this.saving = false;
    }
  }

  private async addExtraLeaders(
    cohortId: string,
    leaders: HcclUserProfileGETData[],
  ): Promise<void> {
    const cohort = await firstValueFrom(this.hcclService.getCohortById(cohortId));
    const teamId = cohort?.teamId;
    if (!teamId || teamId === GlobalConstants.UUID_SENTINEL) {
      throw new Error('Cohort team was not available.');
    }

    const roleRefs = await firstValueFrom(
      this.hcclService.findTeamMemberRoleRefs({
        businessCode: 'Leader',
        pageNumber: 1,
        pageSize: 5,
        isPaging: true,
      }),
    );
    const leaderRoleId =
      roleRefs?.searchResults?.find((r) => r.businessCode === 'Leader')?.id ||
      roleRefs?.searchResults?.[0]?.id;
    if (!leaderRoleId) {
      throw new Error('Leader role reference was not found.');
    }

    const dateAdded = new Date().toISOString().slice(0, 19);

    for (const profile of leaders) {
      if (!profile.id) {
        continue;
      }
      const userId = profile.userId || profile.theUser?.id;
      if (!userId) {
        continue;
      }

      const memberName =
        profile.theUser?.name ||
        profile.entityDisplayName ||
        profile.messageHandle ||
        profile.userEmail ||
        'Leader';

      const memberBody: HcclTeamMemberPOSTData = {
        name: memberName,
        teamId,
        userId,
        userProfileId: profile.id,
        dateAdded,
      };
      const memberResponse = await firstValueFrom(
        this.hcclService.createHcclTeamMember(memberBody),
      );
      const teamMemberId = memberResponse?.id;
      if (!teamMemberId) {
        continue;
      }

      const roleBody: HcclTeamMemberRolePOSTData = {
        teamId,
        teamMemberId,
        teamMemberRoleId: leaderRoleId,
        dateAdded,
      };
      await firstValueFrom(this.hcclService.createHcclTeamMemberRole(roleBody));
    }
  }

  private async ensureFileGroup(): Promise<void> {
    if (!this.cohortId || this.fileGroup || this.creatingFileGroup || this.loadingFileGroup) {
      return;
    }

    this.loadingFileGroup = true;
    try {
      const existing = await firstValueFrom(
        this.hcclService.findPMFileGroups({
          parentEntityId: this.cohortId,
          parentEntityType: 'Cohort',
          optionalDataHint: 'all',
        }),
      );
      const found = existing?.searchResults?.[0];
      if (found) {
        this.fileGroup = found;
        return;
      }

      this.loadingFileGroup = false;
      this.creatingFileGroup = true;
      const cohortName = this.name.trim() || 'Cohort';
      const postData: PMFileGroupPOSTData = {
        parentEntityType: 'Cohort',
        parentEntityId: this.cohortId,
        aspectCode: 'info',
        title: `${cohortName} Materials`,
        instructions: 'Cohort materials',
        available: true,
      };
      const createResponse = await firstValueFrom(this.hcclService.createPMFileGroup(postData));
      if (!createResponse?.id) {
        this.error = 'Failed to create file group: No ID returned.';
        return;
      }

      const reloaded = await firstValueFrom(
        this.hcclService.findPMFileGroups({
          parentEntityId: this.cohortId,
          parentEntityType: 'Cohort',
          optionalDataHint: 'all',
        }),
      );
      this.fileGroup = reloaded?.searchResults?.[0] || null;
      if (!this.fileGroup && createResponse.id) {
        this.fileGroup = await firstValueFrom(
          this.hcclService.getPMFileGroupById(createResponse.id),
        );
      }
    } catch (err) {
      console.error('Error preparing cohort file group:', err);
      this.error = 'Could not prepare materials folder. You can finish and use the Materials tab.';
    } finally {
      this.loadingFileGroup = false;
      this.creatingFileGroup = false;
    }
  }

  finish(): void {
    if (!this.cohortId) {
      this.error = 'Cohort has not been created yet.';
      return;
    }
    this.modalRef.close({ created: true, cohortId: this.cohortId });
  }

  closeModal(): void {
    if (this.cohortId) {
      this.modalRef.close({ created: true, cohortId: this.cohortId });
      return;
    }
    this.modalRef.close({ created: false });
  }
}
