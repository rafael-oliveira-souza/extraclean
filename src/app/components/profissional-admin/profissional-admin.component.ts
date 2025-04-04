import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PipeModule } from '../../pipes/pipe.module';
import { NotificacaoService } from '../../services/notificacao.service';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { ProfissionalService } from '../../services/profissional.service';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { DateUtils } from '../../utils/DateUtils';
import { TipoProfissionalEnum } from '../../domains/enums/TipoProfissionalEnum';

@Component({
  selector: 'app-profissional-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    PipeModule,
    ProfissionalComponent,
  ],
  templateUrl: './profissional-admin.component.html',
  styleUrls: ['./profissional-admin.component.scss']
})
export class ProfissionalAdminComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];

  public indice: number = 0;
  public profissionalSelecionado: number = 0;
  public dataSource = new MatTableDataSource<ProfissionalDTO>();

  public displayedColumns: string[] = [];

  constructor(
    private _notificacaoService: NotificacaoService,
    private _profissionalService: ProfissionalService) {

    this.displayedColumns = [
      'nome', 'sobrenome', 'cpfCnpj', 'telefone', 'dataNascimento', 'porcentagem',
      'segundaDisponivel', 'tercaDisponivel', 'quartaDisponivel', 'quintaDisponivel',
      'sextaDisponivel', 'sabadoDisponivel', 'domingoDisponivel', 'contratada', 'inativado'
    ];
  }

  ngOnInit(): void {
    // if (this.profissionais.length == 0) {
    //   this.recuperarProfissionais();
    // }
    // this.recuperarProfissional();
    this.recuperarProfissionais();
  }

  public recuperarProfissionais() {
    this._profissionalService.todos()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = this.ordenarProfissionais(prof);
        this.profissionais.forEach(profe => profe.inativo = profe.prioridade < 1);
        this.recuperarProfissional();
      });
  }
  
  public ordenarProfissionais(prof: Array<ProfissionalDTO>) {
    return prof
      .sort((a1, a2) => {
        if (a1.nome < a2.nome) return -1;
        if (a1.nome > a2.nome) return 1;
        return 0;
      });
  }

  public recuperarProfissional() {
    if (this.profissionalSelecionado != 0) {
      const profs = this.profissionais.filter(prof => prof.id == this.profissionalSelecionado);
      this.dataSource = new MatTableDataSource<ProfissionalDTO>(profs);
    } else {
      this.dataSource = new MatTableDataSource<ProfissionalDTO>(this.profissionais);
    }

    this.dataSource.paginator = this.paginator;
  }

  public salvarAtualizacoesProf() {
    const profs: ProfissionalDTO[] = this.dataSource.data;
    profs.forEach(prof => {
      if (prof.dataNascimento) {
        prof.dataNascimento = DateUtils.toDate(prof.dataNascimento, DateUtils.ES);
      }

      if (prof.inativo) {
        prof.prioridade = 0;
        prof.segundaDisponivel = false;
        prof.tercaDisponivel = false;
        prof.quartaDisponivel = false;
        prof.quintaDisponivel = false;
        prof.sextaDisponivel = false;
        prof.sabadoDisponivel = false;
        prof.domingoDisponivel = false;
      } else {
        prof.prioridade = 3;
        // prof.segundaDisponivel = true;
        // prof.tercaDisponivel = true;
        // prof.quartaDisponivel = true;
        // prof.quintaDisponivel = true;
        // prof.sextaDisponivel = true;
        // prof.sabadoDisponivel = false;
        // prof.domingoDisponivel = false;
      }
    });

    this._profissionalService.salvar(profs)
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this._notificacaoService.alerta(MensagemEnum.PROFISSIONAIS_ATUALIZADOS_SUCESSO);
      });

  }
}
