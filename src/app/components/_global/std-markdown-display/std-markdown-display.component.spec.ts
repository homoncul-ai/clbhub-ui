import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdMarkdownDisplayComponent } from './std-markdown-display.component';

describe('StdMarkdownDisplayComponent', () => {
  let component: StdMarkdownDisplayComponent;
  let fixture: ComponentFixture<StdMarkdownDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StdMarkdownDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StdMarkdownDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
