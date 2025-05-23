import { NgModule } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { DataSchoolSetupService } from './from_java/services/data-school-setup.service';
import { WireframeDataService } from './from_java/services/wireframe-data.service';
import { initDataAndWireframeFactory } from './from_java/services/init-services.factory';

@NgModule({
  providers: [
    DataSchoolSetupService,
    WireframeDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initDataAndWireframeFactory,
      deps: [DataSchoolSetupService],
      multi: true
    }
  ],
})
export class AppModule { } 