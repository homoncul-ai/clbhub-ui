import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StdBubaComponent } from './std-buba.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-buba-demo',
  standalone: true,
  imports: [CommonModule, StdBubaComponent],
  template: `
    <div class="buba-demo" *ngIf="this.loading == false">
      <h2>Buba Component Demo</h2>
      
      <div class="demo-section">

      <h3>User Profile Buba</h3>
        <app-std-buba 
          entityName="HcclUserProfile" 
          entityId="{{ currentUserProfileId }}"
          profileTypeCode="STUDENT_PROFILE"
          aspect="academic"
          [showLink]="false">
        </app-std-buba>


   <!--      <h3>Catalog Buba</h3>
        <app-std-buba 
          entityName="Catalog" 
          entityId="{{ this.UUID_SENTINEL }}"
          profileTypeCode="this.getProfileTypeCode()"
          aspect="academic"
          [showLink]="false">
        </app-std-buba>
-->
      
      </div>

      
  `,
  styles: [`
    .buba-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      background-color: #f8f9fa;
    }

    .demo-section h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #495057;
    }

    .custom-school-buba {
      background-color: #e3f2fd;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
  `]
})
export class BubaDemoComponent implements OnInit{

  constructor() {
    this.loading = true;
  }

  public readonly UUID_SENTINEL = '00000000-0000-0000-0000-000000000000';
  public loading: boolean = true;
  public currentUserProfileId: string = '';
  public hcclContextService = inject(HcclContextService);
 ngOnInit(): void {
  this.loading = true;
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.currentUserProfileId = context.currentUserProfileId || '';

      this.loading = false;
      //alert('defaultId ' + this.defaultId);
    });

  }
  
  public getProfileTypeCode(): string {
    return 'STUDENT_PROFILE';
  }
}
