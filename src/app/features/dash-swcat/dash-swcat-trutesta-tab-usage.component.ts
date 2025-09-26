import { Component } from '@angular/core';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global';

@Component({
  selector: 'app-swcat-trutesta-tab-usage',
  templateUrl: './dash-swcat-trutesta-tab-usage.component.html',
  standalone: true
})
export class DashSwcatTrutestaTabUsageComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper>{
    constructor() {
        super();
        console.log('DashSwcatTrutestaTabUsageComponent');
    }

    protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
        return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
    }

    protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
        return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
    }
}
