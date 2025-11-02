import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCommentDialog } from './add-edit-comment-dialog';

describe('AddEditCommentDialog', () => {
  let component: AddEditCommentDialog;
  let fixture: ComponentFixture<AddEditCommentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCommentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCommentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
