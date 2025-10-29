import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userscrud } from './userscrud';

describe('Userscrud', () => {
  let component: Userscrud;
  let fixture: ComponentFixture<Userscrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userscrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userscrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
