import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosCrud } from './prestamos-crud';

describe('PrestamosCrud', () => {
  let component: PrestamosCrud;
  let fixture: ComponentFixture<PrestamosCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamosCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamosCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
