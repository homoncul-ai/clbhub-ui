import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  HcclService,
  FamilyUnitGETData,
  FamilyUnitMemberGETData,
  HcclUserProfileGETData,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-familyunit-component',
  templateUrl: './familyunit-component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FamilyunitComponent implements OnInit, OnChanges {
  @Input() familyUnitId?: string;
  @Input() familyUnitGETData?: FamilyUnitGETData;
  /** When 'student', add parent/student buttons are hidden */
  @Input() profileTypeCode?: string;

  familyData: FamilyUnitGETData | null = null;
  loading = false;
  error = '';

  // Modal states
  showAddParentModal = false;
  showAddStudentModal = false;
  showLinkStudentModal = false;

  private hcclService = inject(HcclService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadDataIfNeeded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['familyUnitId'] || changes['familyUnitGETData']) {
      this.loadDataIfNeeded();
    }
  }

  private loadDataIfNeeded(): void {
    if (this.familyUnitGETData) {
      this.familyData = this.familyUnitGETData;
      this.loading = false;
      this.error = '';
      return;
    }
    if (this.familyUnitId) {
      this.loadFamilyUnit();
    } else {
      this.familyData = null;
    }
  }

  private loadFamilyUnit(): void {
    if (!this.familyUnitId) return;
    this.loading = true;
    this.error = '';
    this.hcclService.getFamilyUnitById(this.familyUnitId).subscribe({
      next: (data) => {
        this.familyData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load family unit';
        this.loading = false;
      },
    });
  }

  get parents(): FamilyUnitMemberGETData[] {
    return this.filterMembersByRole('parent');
  }

  get students(): FamilyUnitMemberGETData[] {
    return this.filterMembersByRole('child');
  }

  private filterMembersByRole(role: string): FamilyUnitMemberGETData[] {
    const members = this.familyData?.members ?? [];
    return members.filter(
      (m) => m.role?.toLowerCase() === role.toLowerCase()
    );
  }

  getMemberName(member: FamilyUnitMemberGETData): string {
    const p = member.person;
    if (p?.name) return p.name;
    if (p?.firstName || p?.lastName) {
      return [p.firstName, p.lastName].filter(Boolean).join(' ') || '-';
    }
    return member.entityDisplayName ?? '-';
  }

  getMemberPhone(member: FamilyUnitMemberGETData): string {
    const p = member.person;
    return p?.cellPhoneNumber || p?.workPhoneNumber || '-';
  }

  getMemberEmail(member: FamilyUnitMemberGETData): string {
    return member.person?.userEmail ?? '-';
  }

  openAddParentModal(): void {
    this.showAddParentModal = true;
  }

  closeAddParentModal(): void {
    this.showAddParentModal = false;
  }

  onAddParentSave(): void {
    // TODO: Implement save logic
    this.closeAddParentModal();
  }

  openAddStudentModal(): void {
    this.showAddStudentModal = true;
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
  }

  onAddStudentSave(): void {
    // TODO: Implement save logic
    this.closeAddStudentModal();
  }

  openLinkStudentModal(): void {
    this.showLinkStudentModal = true;
  }

  closeLinkStudentModal(): void {
    this.showLinkStudentModal = false;
  }

  onLinkStudentSave(): void {
    // TODO: Implement save logic
    this.closeLinkStudentModal();
  }

  /** True when add parent/student buttons should be shown */
  get showAddButtons(): boolean {
    return (this.profileTypeCode?.toLowerCase() ?? '') !== 'student';
  }

  /** Get student user profiles for a family member - from person.user.userProfiles or member.user.userProfiles, filtered by profileTypeCode === 'student' */
  getMemberUserProfiles(member: FamilyUnitMemberGETData): HcclUserProfileGETData[] {
    const profiles = member.person?.user?.userProfiles ?? member.user?.userProfiles ?? [];
    return profiles.filter((p) => (p.profileTypeCode ?? '').toLowerCase() === 'student');
  }

  /** Navigate to student monitoring for the given userProfileId */
  monitorStudent(userProfileId: string): void {
    const segments = this.router.url.split('/').filter(Boolean);
    const dashboardBase = segments[0] || 'parent-dashboard';
    this.router.navigate([dashboardBase, 'e', 'studentui', userProfileId]);
  }
}
