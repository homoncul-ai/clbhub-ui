import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '../../restsvc/hccl.service';
import { HcclUserProfileGETData, HcclUserProfileCriteria } from '../../restsvc/hccl.interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hccl-user-profile-details',
  imports: [CommonModule],
  templateUrl: './hccl-user-profile-details.component.html',
  styleUrl: './hccl-user-profile-details.component.scss',
  standalone: true
})
export class HcclUserProfileDetailsComponent implements OnInit, OnDestroy {
  @Input() userProfileId!: string;
  @Input() title?: string;
  
  userProfile: HcclUserProfileGETData | null = null;
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private hcclService: HcclService) {}

  ngOnInit() {
    if (this.userProfileId) {
      this.loadUserProfile();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get displayTitle(): string {
    return this.title || 'User Profile Details';
  }

  private loadUserProfile() {
    this.loading = true;
    this.error = null;

    const criteria: HcclUserProfileCriteria = {
      pageNumber: 1,
      pageSize: 1,
      isPaging: true,
      ids: [this.userProfileId]
    };

    this.hcclService.findHcclUserProfiles(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.searchResults && response.searchResults.length > 0) {
            this.userProfile = response.searchResults[0];
          } else {
            this.error = 'User profile not found';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error loading user profile: ' + (err.message || 'Unknown error');
          console.error('Error loading user profile:', err);
        }
      });
  }

  getAvailableStatus(available?: number): string {
    return available === 1 ? 'Available' : 'Not Available';
  }

  getAvailableStatusClass(available?: number): string {
    return available === 1 ? 'status-available' : 'status-unavailable';
  }

  formatDate(dateData?: any): string {
    if (!dateData) return 'N/A';
    return dateData.formattedDate || dateData.date || 'N/A';
  }

  formatDateTime(dateData?: any): string {
    if (!dateData) return 'N/A';
    return dateData.formattedDateTime || dateData.date || 'N/A';
  }
}
