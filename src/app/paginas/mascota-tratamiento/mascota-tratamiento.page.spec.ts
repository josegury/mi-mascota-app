import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaTratamientoPage } from './mascota-tratamiento.page';

describe('MascotaTratamientoPage', () => {
  let component: MascotaTratamientoPage;
  let fixture: ComponentFixture<MascotaTratamientoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MascotaTratamientoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MascotaTratamientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
