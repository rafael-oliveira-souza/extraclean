import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratacaoComponent } from './contratacao.component';

describe('ContratacaoComponent', () => {
  let component: ContratacaoComponent;
  let fixture: ComponentFixture<ContratacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
