import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmActionDialog } from './confirm-action-dialog';

describe('ConfirmActionDialog', () => {
  let component: ConfirmActionDialog;
  let fixture: ComponentFixture<ConfirmActionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmActionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmActionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
