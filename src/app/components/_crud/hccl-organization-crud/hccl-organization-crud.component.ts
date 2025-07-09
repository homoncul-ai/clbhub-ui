import { Component } from '@angular/core';

@Component({
  selector: 'app-hccl-organization-crud',
  imports: [],
  templateUrl: './hccl-organization-crud.component.html',
  styleUrl: './hccl-organization-crud.component.scss'
})
export class HcclOrganizationCrudComponent {
/**
 * This is a component that will be used to create, read, update and delete HccpOrganization
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the HccpOrganizationGETData and HccpOrganizationPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional organization ID to load a specific organization for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of organizations.
 * If an ID is provided, the component will load that specific organization and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<HccpOrganizationGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 * 
 * Create corresponding template sections for each mode that's in CRUD_MODES
 * 
 * for any UUID, in the data section, use the 'crud' component using the 'fk' mode.
 * editing any UUID, use the 'crud' component using the 'fk-menu' mode.
 */
}
