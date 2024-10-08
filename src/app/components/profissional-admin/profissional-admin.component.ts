import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PipeModule } from '../../pipes/pipe.module';
import { NotificacaoService } from '../../services/notificacao.service';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { TituloComponent } from '../titulo/titulo.component';
import { ProfissionalService } from '../../services/profissional.service';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { DateUtils } from '../../utils/DateUtils';

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

  public indice: number = 0;
  public profissionalSelecionado: number = 0;
  public profissionais: ProfissionalDTO[] = [];
  public dataSource = new MatTableDataSource<ProfissionalDTO>();

  public displayedColumns: string[] = [];

  constructor(
    private _notificacaoService: NotificacaoService,
    private _profissionalService: ProfissionalService) {

    this.displayedColumns = [
      'nome', 'sobrenome', 'telefone', 'dataNascimento', 'porcentagem',
      'segundaDisponivel', 'tercaDisponivel', 'quartaDisponivel', 'quintaDisponivel',
      'sextaDisponivel', 'sabadoDisponivel', 'domingoDisponivel', 'contratada',
    ];
  }

  ngOnInit(): void {
    this.recuperarProfissionais();
  }

  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
        this.recuperarProfissional()
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
    // profs.forEach(prof => prof.dataNascimento = prof.dataNascimento, DateUtils.BR))
    this._profissionalService.salvar(profs)
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this._notificacaoService.alerta(MensagemEnum.PROFISSIONAIS_ATUALIZADOS_SUCESSO);
      });

  }
}
