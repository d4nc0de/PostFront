import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsCrud } from './authors-crud';

describe('AuthorsCrud', () => {
  let component: AuthorsCrud;
  let fixture: ComponentFixture<AuthorsCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
