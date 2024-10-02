import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnderecoDTO } from '../../domains/dtos/EnderecoDTO';
import { CepService } from '../../services/cep.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PipeModule } from '../../pipes/pipe.module';

@Component({
  selector: 'app-cep',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    PipeModule,
    NgxMaskDirective,
    MatCheckboxModule,
    NgxMaskPipe
  ],
  templateUrl: './cep.component.html',
  styleUrls: ['./cep.component.scss']
})
export class CepComponent {

  @Input("formCep")
  public formCep!: FormGroup;

  public exibeCep = false;

  @Output()
  public getEndereco: EventEmitter<EnderecoDTO> = new EventEmitter();

  constructor(private _cepService: CepService,
    private _formBuilder: FormBuilder,
    private _notificacaoService: NotificacaoService) {
    this.montarFormCep(true);
  }


  public atualizarEndereco() {
    let endereco = new EnderecoDTO();
    endereco.bairro = this.formCep.controls['bairro'].value;
    endereco.numero = this.formCep.controls['numero'].value;
    endereco.logradouro = this.formCep.controls['logradouro'].value;
    endereco.complemento = this.formCep.controls['complemento'].value;
    endereco.localidade = this.formCep.controls['localidade'].value;
    endereco.cep = this.formCep.controls['cep'].value;
    endereco.uf = this.formCep.controls['uf'].value;
    endereco.valido = this.formCep.valid;

    this.getEndereco.emit(endereco);
  }

  public getCep(cep: string) {
    this.exibeCep = false;
    if (cep) {
      this._cepService.getCep(cep)
        .subscribe((cepRecuperado: EnderecoDTO) => {
          if (cepRecuperado['erro']) {
            this._notificacaoService.alerta("Cep não encontrado!");
          } else {
            this.exibirCep(cepRecuperado);
          }
        });
    }
  }

  public exibirCep(cepRecuperado: EnderecoDTO) {
    this.exibeCep = true;
    this.formCep.controls['bairro'].setValue(cepRecuperado?.bairro);
    this.formCep.controls['localidade'].setValue(cepRecuperado?.localidade);
    this.formCep.controls['logradouro'].setValue(cepRecuperado?.logradouro);
    this.formCep.controls['uf'].setValue(cepRecuperado?.uf);
  }

  public montarFormCep(habilitaInput: boolean) {
    this.formCep = this._formBuilder.group({
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      numero: ['', Validators.required],
      logradouro: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      complemento: new FormControl({ value: '', disabled: false }),
      bairro: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      localidade: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      uf: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      naoEncontrado: false
    });

    this.formCep.valueChanges.subscribe(cep => {
      if (this.formCep.controls['cep'].invalid) {
        this.exibeCep = false;
      }

      this.atualizarEndereco();
    });

    this.formCep.controls['naoEncontrado'].valueChanges.subscribe(val => {
      if (val) {
        if (this.formCep.controls['cep'].invalid) {
          this.formCep.controls['cep'].setValue("00000000");
        }
        this.formCep.controls['logradouro'].setValue("");
        this.formCep.controls['localidade'].setValue("");
        this.formCep.controls['bairro'].setValue("");
        this.formCep.controls['uf'].setValue("");
        this.formCep.controls['numero'].setValue("");
        this.formCep.controls['logradouro'].enable();
        this.formCep.controls['localidade'].enable();
        this.formCep.controls['bairro'].enable();
        this.formCep.controls['uf'].enable();
      } else {
        this.formCep.controls['cep'].setValue("");
        this.formCep.controls['logradouro'].disable();
        this.formCep.controls['localidade'].disable();
        this.formCep.controls['bairro'].disable();
        this.formCep.controls['uf'].disable();
      }
    });

  }
}
