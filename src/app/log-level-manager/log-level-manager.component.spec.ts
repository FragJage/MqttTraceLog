import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLevelManagerComponent } from './log-level-manager.component';

describe('LogLevelManagerComponent', () => {
  let component: LogLevelManagerComponent;
  let fixture: ComponentFixture<LogLevelManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogLevelManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogLevelManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
