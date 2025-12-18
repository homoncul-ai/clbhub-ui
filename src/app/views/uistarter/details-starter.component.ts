import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StdMarkdownDisplayComponent } from '@app/components/_global';

/**
 * Basic details component - Display entity details in a simple format
 * Also demonstrates the StdMarkdownDisplayComponent usage
 */
@Component({
  selector: 'app-details-starter',
  template: `
    <div class="container mt-4">
      <h2>Student Details</h2>
      
      <div class="detail-section">
        <div class="detail-group">
          <label>Name:</label>
          <span>John Doe</span>
        </div>
        <div class="detail-group">
          <label>Business Code:</label>
          <span>STU001</span>
        </div>
        <div class="detail-group">
          <label>Email:</label>
          <span>john.doe&#64;example.com</span>
        </div>
        <div class="detail-group">
          <label>Cell Phone:</label>
          <span>555-0101</span>
        </div>
        <div class="detail-group">
          <label>Work Phone:</label>
          <span>555-0102</span>
        </div>
        <div class="detail-group">
          <label>School ID:</label>
          <span>SCH001</span>
        </div>
        <div class="detail-group">
          <label>Available:</label>
          <span>Yes</span>
        </div>
      </div>

      <!-- Markdown Display Examples -->
      <h3 class="mt-4">Markdown Display Component Examples</h3>
      
      <!-- Example 1: Basic Common Markdown -->
      <div class="mb-4">
        <h5>1. Common Markdown (default dialect)</h5>
        <app-std-markdown-display 
          title="Student Bio"
          [markdown]="commonMarkdownExample">
        </app-std-markdown-display>
      </div>

      <!-- Example 2: Common Markdown without title -->
      <div class="mb-4">
        <h5>2. Common Markdown without title</h5>
        <app-std-markdown-display 
          [markdown]="simpleMarkdown">
        </app-std-markdown-display>
      </div>

      <!-- Example 3: Common Markdown with max height (scrollable) -->
      <div class="mb-4">
        <h5>3. Common Markdown with max height (scrollable)</h5>
        <app-std-markdown-display 
          title="Long Content"
          [markdown]="longMarkdown"
          maxHeight="200px">
        </app-std-markdown-display>
      </div>

      <!-- Example 4: Markdeep dialect -->
      <div class="mb-4">
        <h5>4. Markdeep Dialect (rendered in iframe)</h5>
        <p class="text-muted small mb-2">
          <em>Markdeep supports diagrams, math equations, and more advanced formatting.</em>
        </p>
        <app-std-markdown-display 
          title="Markdeep Example"
          [markdown]="markdeepExample"
          dialect="markdeep">
        </app-std-markdown-display>
      </div>

      <!-- Example 5: Empty state -->
      <div class="mb-4">
        <h5>5. Empty State</h5>
        <app-std-markdown-display 
          title="No Content"
          [markdown]="emptyMarkdown">
        </app-std-markdown-display>
      </div>

      <!-- Usage Documentation -->
      <div class="card mt-4">
        <div class="card-header">
          <h5 class="mb-0">Usage Documentation</h5>
        </div>
        <div class="card-body">
          <app-std-markdown-display 
            [markdown]="usageDocumentation">
          </app-std-markdown-display>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule, StdMarkdownDisplayComponent]
})
export class DetailsStarterComponent {
  
  // Example for empty state
  emptyMarkdown = '';

  // Example 1: Common markdown with various elements
  commonMarkdownExample = `
## About Me

Hello! I'm a **dedicated student** pursuing a degree in *Computer Science*.

### Skills
- Programming (Python, JavaScript, TypeScript)
- Web Development
- Data Analysis

### Goals
> To become a full-stack developer and contribute to open-source projects.

Check out my [portfolio](https://example.com) for more details.
`;

  // Example 2: Simple markdown
  simpleMarkdown = `This is a **simple** markdown example with *emphasis* and a [link](https://example.com).`;

  // Example 3: Long markdown content
  longMarkdown = `
# Chapter 1: Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Section 1.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 1.2

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Subsection 1.2.1

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 1.3

Here's some code:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Section 1.4

A table example:

| Feature | Status |
|---------|--------|
| Login | Complete |
| Profile | In Progress |
| Settings | Pending |
`;

  // Example 4: Markdeep content
  markdeepExample = `
**Markdeep Demo**

This is rendered using [Markdeep](https://casual-effects.com/markdeep/).

Features include:

- Automatic table of contents
- Diagrams and flowcharts
- Math equations
- Code syntax highlighting

Here's a simple diagram:

*****************************
*    .---.                  *
*   /     \\                 *
*  |  Hi!  |                *
*   \\     /                 *
*    '---'                  *
*****************************

And an inline equation: $ E = mc^2 $
`;

  // Usage documentation
  usageDocumentation = `
## StdMarkdownDisplayComponent

A reusable component for rendering markdown content with support for CommonMark and Markdeep dialects.

### Import

\`\`\`typescript
import { StdMarkdownDisplayComponent } from '@app/components/_global';
\`\`\`

### Basic Usage

\`\`\`html
<app-std-markdown-display 
  [markdown]="yourMarkdownContent">
</app-std-markdown-display>
\`\`\`

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| \`title\` | string | '' | Optional title above content |
| \`markdown\` | string | '' | The markdown content to render |
| \`dialect\` | 'common' \\| 'markdeep' | 'common' | Markdown dialect to use |
| \`modeName\` | 'display' \\| 'edit' | 'display' | Display or edit mode |
| \`cssClass\` | string | '' | Additional CSS class |
| \`maxHeight\` | string | 'none' | Max height with scroll |

### Examples

**With title:**
\`\`\`html
<app-std-markdown-display 
  title="Documentation"
  [markdown]="content">
</app-std-markdown-display>
\`\`\`

**Markdeep dialect:**
\`\`\`html
<app-std-markdown-display 
  [markdown]="markdeepContent"
  dialect="markdeep">
</app-std-markdown-display>
\`\`\`

**Scrollable content:**
\`\`\`html
<app-std-markdown-display 
  [markdown]="longContent"
  maxHeight="300px">
</app-std-markdown-display>
\`\`\`
`;
}
