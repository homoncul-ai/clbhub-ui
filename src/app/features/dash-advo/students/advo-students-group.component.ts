import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudComponent, HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, HcclUserProfileCriteria, HcclUserProfileGETData, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { AdvoMessagesComponent } from '../messages/advo-messages.component'; 
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component'; 
import { HcclUserProfileListComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-list.component';
import { WorkRequestListComponent } from '@app/components/_crud/workrequest/workrequest-list.component';
import { StudentListComponent } from '@app/components/_crud/hccluserprofile/student-list.component';

@Component({
  selector: 'app-advo-students-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, AdvoMessagesComponent,
     HcclUserProfileListComponent, HcclUserProfileCrudComponent, WorkRequestListComponent, StudentListComponent]  ,
  templateUrl: './advo-students-group.component.html',
  styleUrl: './advo-students-group.component.scss'
})
export class AdvoStudentsGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      //this.setupWorkRequestListBlocks();
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
      //alert('defaultId ' + this.defaultId);
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
    //alert(this.childId);
    if (this.childId != null) {      
      this.student = await  HcclUserProfileCrudWrapper.newInstance(this.childId || '', this.hcclService);
      let studentS: HcclUserProfileCrudWrapper = this.student; 

      //debugger;
    }
   
    var profile = await HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
    
    return profile;
  }

  protected student: HcclUserProfileCrudWrapper | null = null; 
  override getDetailsTabLabel(): string {
    //alert('getDetailsTabLabel ' + this.student?.dump()  + ' ' + this.childId);
    return this.student?.getExternalUserName() || this.student?.getUserEmail() || '';
  }

  protected setupTabs(): SimpleTab[] {
    //debugger
    const baseRoute = this.getBaseRoute();

    const tabs: SimpleTab[] = [
      new SimpleTab('home', 'Students', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
    if (this.childId != null) {
      let tab : SimpleTab = new SimpleTab('student', this.getDetailsTabLabel(), '', 
        () => {
          
            this.router.navigate([baseRoute,  'student', this.childId]);
            
        },
        () => {
          return this.childId !== null;
        }
      );
      tabs.push(tab);

      tab  = new SimpleTab('tickets', 'Tickets', '', 
      () => {
        
          this.router.navigate([baseRoute,  'tickets', this.childId]);
          
      },
      () => {
        return this.childId !== null;
      }
      );
      tabs.push(tab);
    }
     

      return tabs;

  }

  protected override getDefaultTabId(): string {
    return 'home';
  }


  onClickRowStudent(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.alertMessage = 'Student';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/advocate-dashboard', 'students',  'student', id];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }


  getMyAcceptedOpenTickets(): WorkRequestCriteria {
    return {
      acceptedByUserId: this.hcclContextService.getCurrentUserProfile().userId || ''
    };
  }

  getMyStudentsCriteria(): HcclUserProfileCriteria {
    const criteria: HcclUserProfileCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      profileTypeCode: 'Student',
      organizationId: this.hcclContextService.getCurrentUserProfile().organizationId || '' // Use the organization ID from current user profile
    };
    return criteria;
  }

  getMyStudentTicketsCriteria(): WorkRequestCriteria {
    var clientId = this.childId || '';
    var criteria: WorkRequestCriteria = {
      clientUserProfileId: clientId
    };
    return criteria;
  }
  onClickWorkRequestRow(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.alertMessage = 'Ticket';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/advocate-dashboard', 'workrequests', id, 'update'];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }

}
export class WorkRequestListBlock {
    public title: string = '';
    public criteria: WorkRequestCriteria = {};
    public helptext: string = '';

    constructor(  title: string,   helptext: string,   criteria: WorkRequestCriteria) {
      this.title = title;
      this.criteria = criteria;
      this.helptext = helptext;
    }
  } 