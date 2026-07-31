import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AbstractListComponent } from '../../../components/_global/abstract-list/abstract-list.component';
import {
  HcclUserCriteria,
  HcclUserGETData,
  HcclUserGETDataSearchResults,
  HcclUserProfileGETData,
} from '../../../restsvc/hccl.service';

/**
 * Extra display fields merged onto each user row from its profiles.
 */
interface UserRowExtras {
  __email?: string;
  __profileCount?: number;
}

type UserRow = HcclUserGETData & UserRowExtras;

/**
 * Page 1 - EcoAdmin User Management search list.
 *
 * Reuses the shared AbstractListComponent template + DHTMLX grid. Search is a
 * combined query across HcclUsers (name/businessCode/externalUserName) and
 * HcclUserProfiles (email/handle), merged by userId so admins can find a user
 * by any of those fields.
 */
@Component({
  selector: 'app-user-management-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class UserManagementListComponent extends AbstractListComponent<
  UserRow,
  HcclUserCriteria,
  HcclUserGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeadingLabel = 'User Management';
    this.searchHeading = 'User Management';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
    this.searchPlaceholder = 'Search by name, email, username, or handle';
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'username', header: [{ text: 'Username', align: 'center' }, { content: 'inputFilter' }], minWidth: 160, adjust: true },
      { id: 'email', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      {
        id: 'status',
        header: [{ text: 'Status', align: 'center' }],
        minWidth: 110,
        align: 'center',
        htmlEnable: true,
        template: (value: any, row: any) => {
          const active = row?.available === 1;
          const cls = active ? 'badge bg-success' : 'badge bg-secondary';
          const label = active ? 'Active' : 'Inactive';
          return `<span class="${cls}">${label}</span>`;
        },
      },
      { id: 'profileCount', header: [{ text: 'Profiles', align: 'center' }], minWidth: 90, align: 'center', adjust: true },
      { id: 'registerMethod', header: [{ text: 'Register Method', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Last Updated', align: 'center' }], minWidth: 140, adjust: true },
    ];
  }

  protected createCriteria(): HcclUserCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  /**
   * Combined search: run the user and profile queries in parallel and merge by
   * userId. Profiles that match users not returned by the user query are
   * back-filled (via profile.theUser, or a follow-up id lookup).
   */
  protected findEntities(
    criteria: HcclUserCriteria,
  ): Observable<HcclUserGETDataSearchResults> {
    const searchByText = (criteria as any).searchByText as string | undefined;

    const users$ = this.hcclService.findHcclUsers({
      pageNumber: criteria.pageNumber,
      pageSize: criteria.pageSize,
      isPaging: criteria.isPaging,
      searchByText,
    });

    const profiles$ = this.hcclService.findHcclUserProfiles({
      pageNumber: 1,
      pageSize: 200,
      isPaging: true,
      searchByText,
    });

    return forkJoin([users$, profiles$]).pipe(
      switchMap(([usersRsp, profilesRsp]) => {
        const users = usersRsp.searchResults ?? [];
        const profiles = profilesRsp.searchResults ?? [];

        const userMap = new Map<string, UserRow>();
        users.forEach((u) => {
          if (u.id) {
            userMap.set(u.id, { ...u });
          }
        });

        // Group profiles by userId.
        const profilesByUser = new Map<string, HcclUserProfileGETData[]>();
        profiles.forEach((p) => {
          if (!p.userId) {
            return;
          }
          const arr = profilesByUser.get(p.userId) ?? [];
          arr.push(p);
          profilesByUser.set(p.userId, arr);
        });

        // Back-fill users that only matched via a profile.
        const missingUserIds: string[] = [];
        profilesByUser.forEach((profs, userId) => {
          if (userMap.has(userId)) {
            return;
          }
          const fromProfile = profs.find((p) => p.theUser)?.theUser;
          if (fromProfile) {
            userMap.set(userId, { ...fromProfile });
          } else {
            missingUserIds.push(userId);
          }
        });

        const merge = (): HcclUserGETDataSearchResults => {
          userMap.forEach((user, userId) => {
            const profs =
              profilesByUser.get(userId) ?? user.userProfiles ?? [];
            user.__profileCount = profs.length;
            user.__email =
              profs.find((p) => p.userEmail)?.userEmail ||
              user.person?.userEmail ||
              '';
          });
          return {
            pagingInfo: usersRsp.pagingInfo,
            searchResults: Array.from(userMap.values()),
          };
        };

        if (missingUserIds.length === 0) {
          return of(merge());
        }

        return this.hcclService
          .findHcclUsers({ ids: missingUserIds, isPaging: false })
          .pipe(
            map((extraRsp) => {
              (extraRsp.searchResults ?? []).forEach((u) => {
                if (u.id) {
                  userMap.set(u.id, { ...u });
                }
              });
              return merge();
            }),
          );
      }),
    );
  }

  protected hasSearchResults(
    response: HcclUserGETDataSearchResults,
  ): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(
    response: HcclUserGETDataSearchResults,
  ): UserRow[] {
    const rows = (response.searchResults as UserRow[]) || [];
    // Temporary debug: log registerMethod for each user.
    rows.forEach((u) => {
      console.log(
        `[UserManagement] registerMethod for ${u.businessCode || u.id}:`,
        u.registerMethod ?? '(undefined)',
      );
    });
    return rows;
  }

  protected override formatEntityData(entity: UserRow): any {
    return {
      username: entity.businessCode || entity.externalUserName || '',
      email: entity.__email || '',
      profileCount: entity.__profileCount ?? 0,
      registerMethod: entity.registerMethod ?? '(undefined)',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
    };
  }

  /**
   * Navigate to the detail page at /ecoadmin-dashboard/user-management/{userId}
   * (no trailing /details segment).
   */
  protected override onRowClick(entityId: string): void {
    this.router.navigate(['/ecoadmin-dashboard/user-management', entityId]);
  }
}
