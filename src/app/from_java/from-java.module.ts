import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DataSchoolSetupService } from './services/data-school-setup.service';
import { WireframeDataService } from './services/wireframe-data.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        DataSchoolSetupService,
        WireframeDataService
    ],
    exports: []
})
export class FromJavaModule { } 