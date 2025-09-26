import { Component } from '@angular/core';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global';

@Component({
  selector: 'app-swcat-sematree-tab-overview',
  templateUrl: './dash-swcat-sematree-tab-overview.component.html',
  standalone: true
})
export class DashSwcatSematreeTabOverviewComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper>{
    constructor() {
        super();
        console.log('DashSwcatSematreeTabOverviewComponent');
    }

    protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
        return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
    }

    protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
        return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
    }
}
