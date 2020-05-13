import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaTratamientosPage } from './mascota-tratamientos.page';

describe('MascotaTratamientosPage', () => {
  let component: MascotaTratamientosPage;
  let fixture: ComponentFixture<MascotaTratamientosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MascotaTratamientosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MascotaTratamientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
