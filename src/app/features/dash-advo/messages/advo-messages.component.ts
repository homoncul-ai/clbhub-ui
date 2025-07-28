import { Component } from '@angular/core';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global';

@Component({
  selector: 'app-advo-messages',
  template: `<div>Advocate Messages</div>`,
  standalone: true
})
export class AdvoMessagesComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper>{
    constructor() {
        super();
        console.log('AdvoMessagesComponent');
    }

    protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
        return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
    }

    protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
        return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
    }

    
} 