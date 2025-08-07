import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUD_MODES } from '@app/@core/constants';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { DategetdataDisplayComponent } from '../dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '../reference-data/reference-data.component';

@Component({
  selector: 'app-crud-internal-data',
  standalone: true,
  imports: [CommonModule, DategetdataDisplayComponent, ReferenceDataComponent],
  templateUrl: './crud-internal-data.component.html',
  styleUrl: '../../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class CrudInternalDataComponent {
  @Input() crudWrapper: EntityWrapper<any> | null = null;
  @Input() crudMode: string = CRUD_MODES.DETAIL;

  // this component should pull the following fields that all crud components should have
  // dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo
  // and display them in a matrix with the following row column
  //  Date Created:  [dateCreated] ,  Created By : [createdByInfo]
  //  Date Last Updated:  [dateLastUpdated] ,  Last Updated By : [lastUpdatedByInfo]

  get dateCreated(): any {
    return this.crudWrapper?.getData()?.dateCreated || null;
  }

  get dateLastUpdated(): any {
    return this.crudWrapper?.getData()?.dateLastUpdated || null;
  }

  get createdByInfo(): any {
    return this.crudWrapper?.getData()?.createdByInfo || null;
  }

  get lastUpdatedByInfo(): any {
    return this.crudWrapper?.getData()?.lastUpdatedByInfo || null;
  }

  get isDetailMode(): boolean {
    return this.crudMode === CRUD_MODES.DETAIL;
  }
}
