import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpExerciseComponent } from './http-exercise.component';

describe('HttpExerciseComponent', () => {
  let component: HttpExerciseComponent;
  let fixture: ComponentFixture<HttpExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
