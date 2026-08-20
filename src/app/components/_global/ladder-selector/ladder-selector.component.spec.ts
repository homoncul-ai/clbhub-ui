import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LadderSelectorComponent } from './ladder-selector.component';
import { CAREER_LADDERS } from '@app/shared/data/career-ladders';

describe('LadderSelectorComponent', () => {
  let component: LadderSelectorComponent;
  let fixture: ComponentFixture<LadderSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LadderSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LadderSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce maxAllowedToChoose of 1 by replacing selection', () => {
    component.maxAllowedToChoose = 1;
    const first = CAREER_LADDERS[0];
    const second = CAREER_LADDERS[1];

    component.toggleLadder(first);
    expect(component.isSelected(first.id)).toBeTrue();

    component.toggleLadder(second);
    expect(component.isSelected(first.id)).toBeFalse();
    expect(component.isSelected(second.id)).toBeTrue();
    expect(component.chosenLadders.length).toBe(1);
  });

  it('should ignore extras when maxAllowedToChoose is greater than 1', () => {
    component.maxAllowedToChoose = 2;
    component.toggleLadder(CAREER_LADDERS[0]);
    component.toggleLadder(CAREER_LADDERS[1]);
    component.toggleLadder(CAREER_LADDERS[2]);

    expect(component.chosenLadders.length).toBe(2);
    expect(component.isSelected(CAREER_LADDERS[2].id)).toBeFalse();
  });
});
