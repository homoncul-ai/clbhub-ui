import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '../../restsvc/hccl.service';
import { CLStudentGETData } from '../../restsvc/hccl.interfaces';

@Component({
  selector: 'app-clstudent',
  imports: [CommonModule],
  templateUrl: './clstudent.component.html',
  styleUrl: './clstudent.component.scss'
})
export class ClstudentComponent implements OnInit {
/** Update the clstudent component to use the hccl.service.ts and hccl.interfaces.ts and load 
 * CLStudenGETData from HcclService with the "id" paramater passed into the component
 * I want to display the data in the component.html file
 * I want to use the hccl.interfaces.ts to define the interface for the data
 * I want to use the hccl.service.ts to call the service
 * I want to use the hccl.interfaces.ts to define the interface for the data
 * 
 * Ignore tenantId, 
 */

  @Input() id!: string;
  
  studentData?: CLStudentGETData;
  loading = false;
  error?: string;

  constructor(private hcclService: HcclService) {}

  ngOnInit(): void {
    if (this.id) {
      this.loadStudentData();
    }
  }

  private loadStudentData(): void {
    this.loading = true;
    this.error = undefined;
    
    this.hcclService.getCLStudentById(this.id).subscribe({
      next: (data: CLStudentGETData) => {
        this.studentData = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load student data';
        this.loading = false;
        console.error('Error loading student data:', error);
      }
    });
  }
}
