import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, CLStudentCriteria, CLSchoolCriteria, CLGuidanceCriteria, SimpleRestActionResponse } from '@app/restsvc/hccl.service';
import { CLSchoolListComponent } from '@app/components/_crud/clschool/clschool-list.component';
import { CLStudentListComponent } from '@app/components/_crud/clstudent/clstudent-list.component';
import { CLStudentCrudComponent } from '@app/components/_crud/clstudent/clstudent-crud.component';
import { CLSchoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';
import { CLGuidanceListComponent } from '@app/components/_crud/clguidance/clguidance-list.component';
import { CLGuidanceCrudComponent } from '@app/components/_crud/clguidance/clguidance-crud.component';
import { OnGoClickActionBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-integrations-home',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLSchoolListComponent, CLStudentListComponent, CLGuidanceListComponent, CLSchoolCrudComponent, CLStudentCrudComponent, CLGuidanceCrudComponent],
  templateUrl: './integrations-home.component.html',
  styleUrl: './integrations-home.component.scss'
})
export class IntegrationsHomeComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
      //alert('ngOnInit: ' + this.tabId + ' ' + this.childId);
    });
  }

  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    //alert('loadEntityById: ' + id + ' ' + this.tabId + ' ' + this.childId);
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    return [
      new SimpleTab('home', 'Home', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('guidance', 'Guidance', '', 
        () => {
          this.router.navigate([baseRoute, 'guidance']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('schools', 'Schools', '', 
        () => {
          this.router.navigate([baseRoute, 'schools']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('students', 'Students', '', 
        () => {
          this.router.navigate([baseRoute, 'students']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('school', 'School', '', 
        () => {
          this.router.navigate([baseRoute, 'school']);
        },
        () => {
          return this.childId != null && this.currentTabId == 'school';
        }
      ),
      new SimpleTab('student', 'Student', '', 
        () => {
          this.router.navigate([baseRoute, 'student']);
        },
        () => {
          return this.childId != null && this.currentTabId == 'student';
        }
      )];
  }

  protected override getDefaultTabId(): string {
    return 'home';
  }

  protected getSchoolsCriteria(): CLSchoolCriteria {
    return {};
  }

  protected getStudentsCriteria(): CLStudentCriteria {
    return {};
  }

  protected getGuidanceCriteria(): CLGuidanceCriteria {
    return {};
  }
  protected getOnRowClickBehavior(): OnRowClickBehavior {
    return OnRowClickBehavior.getOnRowClickDoNothing();
  }
  protected getOnRowClickBehaviorForSchool(): OnRowClickBehavior {
    let x: OnRowClickBehavior = OnRowClickBehavior.getOnRowClickDoNothing();
    x.doNotNavigate = false;
    x.parentId = this.id
    x.tabId = "school";
    x.usingNavigateUrl = true;
   // x.alertMessage = "Navigate to school";
    x.getNavigateUrl = (entityId: string, baseRoute: string) => {
      return [baseRoute, 'school', entityId];
    }
    return x;
  }
  protected getOnRowClickBehaviorForStudent(): OnRowClickBehavior {
    let x: OnRowClickBehavior = OnRowClickBehavior.getOnRowClickDoNothing();
    x.doNotNavigate = false;
    x.parentId = this.id
    x.tabId = "student";
    x.usingNavigateUrl = true;
   // x.alertMessage = "Navigate to student";
    x.getNavigateUrl = (entityId: string, baseRoute: string) => {
      return [baseRoute, 'student', entityId];
    }
    return x;
  }

  protected getOnGoClickBehaviorForCLStudent(): OnGoClickActionBehavior {
    var o : OnGoClickActionBehavior = new OnGoClickActionBehavior();
    o.onGoClick = async (entityIds: string[], baseRoute: string, router: Router) => {
      this.promoteStudents(entityIds);
    }
    o.alertMessage = 'Promote students:';
    return o;
  }

  promoteStudents(entityIds: string[]) { 
    const studentIds = entityIds;
    console.log('Promoting students:', studentIds);


    // TODO: Implement promotion logic
    //alert(`Promoting ${checkedRows.length} student(s)` + ' ' + studentIds.join(', '));
    var criteria: CLStudentCriteria = {
      ids: studentIds,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
    this.hcclService.promoteStudentsToUsers(criteria).subscribe({
      next: (response: SimpleRestActionResponse) => {
        //alert('Promotion successful');
        let rndStr: string = Math.random().toString(36).substring(2, 15);
        // Works - URL looks bad
        //this.router.navigate([this.getBaseRoute(), 'students', rndStr]);
        window.location.href = this.router.createUrlTree([this.getBaseRoute(), 'students']).toString();

      },
      error: (error: any) => {
        alert('Promotion failed');
      }
    });

  }
} 