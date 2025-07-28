import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { AdvoMessagesComponent } from '../messages/advo-messages.component';

@Component({
  selector: 'app-advo-dash-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, AdvoMessagesComponent],
  templateUrl: './advo-dash-group.component.html',
  styleUrl: './advo-dash-group.component.scss'
})
export class AdvoDashGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
    
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
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    debugger
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
      new SimpleTab('messages', 'Messages', '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute,  'messages']);
        },
        () => {
          return this.entity !== null;
        }
      )];

  }

  protected override getDefaultTabId(): string {
    return 'home';
  }

} 