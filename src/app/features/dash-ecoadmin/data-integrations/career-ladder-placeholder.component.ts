import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/** Placeholder until Career Ladder admin (HCCL-51 Update Ladders) is implemented. */
@Component({
  selector: 'app-career-ladder-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container py-4">
      <section class="card border-0 shadow-sm">
        <div class="card-body p-4 p-md-5">
          <h1 class="h4 mb-2">Career Ladder</h1>
          <p class="text-muted mb-0">
            Update Ladders and related Career Ladder admin will live here. Not implemented yet.
          </p>
        </div>
      </section>
    </main>
  `,
})
export class CareerLadderPlaceholderComponent {}
