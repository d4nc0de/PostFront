import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiesCrud } from './copies-crud';

describe('CopiesCrud', () => {
  let component: CopiesCrud;
  let fixture: ComponentFixture<CopiesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopiesCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopiesCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
