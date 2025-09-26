import { Component } from '@angular/core';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global';

@Component({
  selector: 'app-swcat-trutesta-tab-overview',
  templateUrl: './dash-swcat-trutesta-tab-overview.component.html',
  standalone: true
})
export class DashSwcatTrutestaTabOverviewComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper>{
    constructor() {
        super();
        console.log('DashSwcatTrutestaTabOverviewComponent');
    }

    protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
        return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
    }

    protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
        return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
    }
}
