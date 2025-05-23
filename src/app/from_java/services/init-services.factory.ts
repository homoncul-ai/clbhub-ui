import { DataSchoolSetupService } from './data-school-setup.service';
import { WireframeDataService } from './wireframe-data.service';

export function initDataAndWireframeFactory(dataSchoolSetup: DataSchoolSetupService) {
  return async () => {
    await dataSchoolSetup.loadFromYaml();
    WireframeDataService.initialize(dataSchoolSetup);
  };
} 