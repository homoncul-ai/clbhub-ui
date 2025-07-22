import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclTeamMemberGETData, HcclTeamMemberCriteria, HcclService } from '@app/restsvc/hccl.service';
import { HcclTeamMemberCrudWrapper } from './teammember-crud.component';
import { SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-teammember-group',
  templateUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.html',
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  imports: [CommonModule],
  standalone: true
})
export class TeamMemberGroupComponent extends AbstractEntityGroupComponent<HcclTeamMemberCrudWrapper> {

  constructor() {
    super();
  }

  protected async loadEntityById(id: string): Promise<HcclTeamMemberCrudWrapper> {
    const teammember = await this.hcclService.getHcclTeamMemberById(id).toPromise();
    if (!teammember) {
      throw new Error('TeamMember not found');
    }
    return new HcclTeamMemberCrudWrapper(teammember, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '/ecoadmin-dashboard/teamMembers/detail', () => {}, () => true),
      new SimpleTab('edit', 'Edit', '/ecoadmin-dashboard/teamMembers/edit', () => {}, () => true),
      new SimpleTab('delete', 'Delete', '/ecoadmin-dashboard/teamMembers/delete', () => {}, () => true)
    ];
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclTeamMemberCrudWrapper> {
    const teammember = await this.hcclService.getHcclTeamMemberById(id).toPromise();
    if (!teammember) {
      throw new Error('TeamMember not found');
    }
    return new HcclTeamMemberCrudWrapper(teammember, this.hcclService);
  }

  protected createWrapper(entity: HcclTeamMemberGETData): HcclTeamMemberCrudWrapper {
    return new HcclTeamMemberCrudWrapper(entity, this.hcclService);
  }

  protected getDefaultCriteria(): HcclTeamMemberCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected getEntityType(): string {
    return 'TeamMember';
  }

  protected getEntityDisplayName(): string {
    return 'Team Member';
  }

  protected getEntityDisplayNamePlural(): string {
    return 'Team Members';
  }

  protected getCreateRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/create';
  }

  protected getDetailRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/detail';
  }

  protected getListRoute(): string {
    return '/ecoadmin-dashboard/teamMembers';
  }

  protected getEditRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/edit';
  }

  protected getDeleteRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/delete';
  }

  protected getSearchRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/search';
  }

  protected getGroupRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/group';
  }

  protected getTabRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/tab';
  }

  protected getFkRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/fk';
  }

  protected getFkMenuRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/fk-menu';
  }

  protected getHeadingRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/heading';
  }

  protected getDebugRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/debug';
  }

  protected getSectionRoute(): string {
    return '/ecoadmin-dashboard/teamMembers/section';
  }

  protected getCreateComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getDetailComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getEditComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getDeleteComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getSearchComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getGroupComponentName(): string {
    return 'TeamMemberGroupComponent';
  }

  protected getTabComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getFkComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getFkMenuComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getHeadingComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getDebugComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getSectionComponentName(): string {
    return 'TeamMemberCrudComponent';
  }

  protected getCreateComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getDetailComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getEditComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getDeleteComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getSearchComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getGroupComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-group.component';
  }

  protected getTabComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getFkComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getFkMenuComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getHeadingComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getDebugComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getSectionComponentPath(): string {
    return '@app/components/_crud/teammember/teammember-crud.component';
  }

  protected getCreateIcon(): string {
    return 'fa-plus';
  }

  protected getDetailIcon(): string {
    return 'fa-eye';
  }

  protected getEditIcon(): string {
    return 'fa-edit';
  }

  protected getDeleteIcon(): string {
    return 'fa-trash';
  }

  protected getSearchIcon(): string {
    return 'fa-search';
  }

  protected getGroupIcon(): string {
    return 'fa-users';
  }

  protected getTabIcon(): string {
    return 'fa-tabs';
  }

  protected getFkIcon(): string {
    return 'fa-link';
  }

  protected getFkMenuIcon(): string {
    return 'fa-list';
  }

  protected getHeadingIcon(): string {
    return 'fa-header';
  }

  protected getDebugIcon(): string {
    return 'fa-bug';
  }

  protected getSectionIcon(): string {
    return 'fa-section';
  }

  protected getCreateLabel(): string {
    return 'Create Team Member';
  }

  protected getDetailLabel(): string {
    return 'View Team Member';
  }

  protected getEditLabel(): string {
    return 'Edit Team Member';
  }

  protected getDeleteLabel(): string {
    return 'Delete Team Member';
  }

  protected getSearchLabel(): string {
    return 'Search Team Members';
  }

  protected getGroupLabel(): string {
    return 'Team Member Group';
  }

  protected getTabLabel(): string {
    return 'Team Member Tab';
  }

  protected getFkLabel(): string {
    return 'Team Member FK';
  }

  protected getFkMenuLabel(): string {
    return 'Team Member FK Menu';
  }

  protected getHeadingLabel(): string {
    return 'Team Member Heading';
  }

  protected getDebugLabel(): string {
    return 'Team Member Debug';
  }

  protected getSectionLabel(): string {
    return 'Team Member Section';
  }

  protected getCreateHelpText(): string {
    return 'Create a new team member';
  }

  protected getDetailHelpText(): string {
    return 'View team member details';
  }

  protected getEditHelpText(): string {
    return 'Edit team member information';
  }

  protected getDeleteHelpText(): string {
    return 'Delete team member';
  }

  protected getSearchHelpText(): string {
    return 'Search for team members';
  }

  protected getGroupHelpText(): string {
    return 'Manage team member groups';
  }

  protected getTabHelpText(): string {
    return 'Team member tab view';
  }

  protected getFkHelpText(): string {
    return 'Team member foreign key';
  }

  protected getFkMenuHelpText(): string {
    return 'Team member foreign key menu';
  }

  protected getHeadingHelpText(): string {
    return 'Team member heading';
  }

  protected getDebugHelpText(): string {
    return 'Team member debug information';
  }

  protected getSectionHelpText(): string {
    return 'Team member section';
  }

  protected getCreateRoleRequired(): string {
    return 'ADMIN';
  }

  protected getDetailRoleRequired(): string {
    return 'USER';
  }

  protected getEditRoleRequired(): string {
    return 'ADMIN';
  }

  protected getDeleteRoleRequired(): string {
    return 'ADMIN';
  }

  protected getSearchRoleRequired(): string {
    return 'USER';
  }

  protected getGroupRoleRequired(): string {
    return 'USER';
  }

  protected getTabRoleRequired(): string {
    return 'USER';
  }

  protected getFkRoleRequired(): string {
    return 'USER';
  }

  protected getFkMenuRoleRequired(): string {
    return 'USER';
  }

  protected getHeadingRoleRequired(): string {
    return 'USER';
  }

  protected getDebugRoleRequired(): string {
    return 'ADMIN';
  }

  protected getSectionRoleRequired(): string {
    return 'USER';
  }

  protected getCreateAllowedByRule(): boolean {
    return true;
  }

  protected getDetailAllowedByRule(): boolean {
    return true;
  }

  protected getEditAllowedByRule(): boolean {
    return true;
  }

  protected getDeleteAllowedByRule(): boolean {
    return true;
  }

  protected getSearchAllowedByRule(): boolean {
    return true;
  }

  protected getGroupAllowedByRule(): boolean {
    return true;
  }

  protected getTabAllowedByRule(): boolean {
    return true;
  }

  protected getFkAllowedByRule(): boolean {
    return true;
  }

  protected getFkMenuAllowedByRule(): boolean {
    return true;
  }

  protected getHeadingAllowedByRule(): boolean {
    return true;
  }

  protected getDebugAllowedByRule(): boolean {
    return true;
  }

  protected getSectionAllowedByRule(): boolean {
    return true;
  }

  protected getCreateActive(): boolean {
    return true;
  }

  protected getDetailActive(): boolean {
    return true;
  }

  protected getEditActive(): boolean {
    return true;
  }

  protected getDeleteActive(): boolean {
    return true;
  }

  protected getSearchActive(): boolean {
    return true;
  }

  protected getGroupActive(): boolean {
    return true;
  }

  protected getTabActive(): boolean {
    return true;
  }

  protected getFkActive(): boolean {
    return true;
  }

  protected getFkMenuActive(): boolean {
    return true;
  }

  protected getHeadingActive(): boolean {
    return true;
  }

  protected getDebugActive(): boolean {
    return true;
  }

  protected getSectionActive(): boolean {
    return true;
  }

  protected getCreateSelected(): boolean {
    return false;
  }

  protected getDetailSelected(): boolean {
    return false;
  }

  protected getEditSelected(): boolean {
    return false;
  }

  protected getDeleteSelected(): boolean {
    return false;
  }

  protected getSearchSelected(): boolean {
    return false;
  }

  protected getGroupSelected(): boolean {
    return false;
  }

  protected getTabSelected(): boolean {
    return false;
  }

  protected getFkSelected(): boolean {
    return false;
  }

  protected getFkMenuSelected(): boolean {
    return false;
  }

  protected getHeadingSelected(): boolean {
    return false;
  }

  protected getDebugSelected(): boolean {
    return false;
  }

  protected getSectionSelected(): boolean {
    return false;
  }

  protected getCreateGroupId(): string {
    return 'teamMember';
  }

  protected getDetailGroupId(): string {
    return 'teamMember';
  }

  protected getEditGroupId(): string {
    return 'teamMember';
  }

  protected getDeleteGroupId(): string {
    return 'teamMember';
  }

  protected getSearchGroupId(): string {
    return 'teamMember';
  }

  protected getGroupGroupId(): string {
    return 'teamMember';
  }

  protected getTabGroupId(): string {
    return 'teamMember';
  }

  protected getFkGroupId(): string {
    return 'teamMember';
  }

  protected getFkMenuGroupId(): string {
    return 'teamMember';
  }

  protected getHeadingGroupId(): string {
    return 'teamMember';
  }

  protected getDebugGroupId(): string {
    return 'teamMember';
  }

  protected getSectionGroupId(): string {
    return 'teamMember';
  }
} 