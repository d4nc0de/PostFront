import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionsCrud } from './editions-crud';

describe('EditionsCrud', () => {
  let component: EditionsCrud;
  let fixture: ComponentFixture<EditionsCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionsCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionsCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
