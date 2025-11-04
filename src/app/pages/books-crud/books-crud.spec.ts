import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCrud } from './books-crud';

describe('BooksCrud', () => {
  let component: BooksCrud;
  let fixture: ComponentFixture<BooksCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
