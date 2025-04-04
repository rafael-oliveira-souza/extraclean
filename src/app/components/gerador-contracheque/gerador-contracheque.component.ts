import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ProfissionalService } from '../../services/profissional.service';
import { CalculoFuncionarioDTO } from '../../domains/dtos/CalculoFuncionarioDTO';
import { DateUtils } from '../../utils/DateUtils';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContraChequeProfissionalDTO } from '../../domains/dtos/ContraChequeProfissionalDTO';
import { PagamentoProfissionalDTO } from '../../domains/dtos/PagamentoProfissionalDTO';
import { PipeModule } from '../../pipes/pipe.module';
import jsPDF from 'jspdf';
import { MomentInput } from 'moment';
import { TipoProfissionalEnum } from '../../domains/enums/TipoProfissionalEnum';
import { AgendamentoService } from '../../services/agendamento.service';
import { TotaisDTO } from '../../domains/dtos/TotaisDTO';

@Component({
  selector: 'app-gerador-contracheque',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    PipeModule
  ],
  templateUrl: './gerador-contracheque.component.html',
  styleUrls: ['./gerador-contracheque.component.scss']
})
export class GeradorContrachequeComponent implements OnInit {

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];
  public readonly salarioBasePadrao: number = 1450;
  public readonly planoSaudePadrao: number = 0;
  public readonly valeTransportePadrao: number = 405;
  public readonly valeAlimentacaoPadrao: number = 195;
  public readonly PORCENTAGEM_GERENTE: number = 0.3;
  public readonly VL_FIXO_GERENTE: number = 500;

  public hoje: Date = DateUtils.newDate();
  public periodo: number = this.hoje.getMonth();
  public horasExtras: number = 0;
  public numFeriados: number = 0;
  public pagamentos: PagamentoProfissionalDTO[] = [];
  public servicos: PagamentoProfissionalDTO[] = [];
  public salarioBase: number = this.salarioBasePadrao;
  public totais: TotaisDTO = new TotaisDTO();
  public FGTS: number = 116;
  public planoSaude: number = this.planoSaudePadrao;
  public valeTransporte: number = this.valeAlimentacaoPadrao;
  public valeAlimentacao: number = this.valeAlimentacaoPadrao;
  public profissionalSelecionado!: ProfissionalDTO;
  public adicionalExtra = 1; // Adicional de 50% para horas extras durante a semana
  public horasMensais: number = this.calcularHorasTotais();
  public horasTrabalhadas: number = this.horasMensais;
  public diaSelecionado: number = 0;
  public ano: number = 2025;
  public ignorarDescontos: boolean = false;
  public datasNoMes: Date[] = [];
  public ehGerente: boolean = false;

  constructor(public profissionalService: ProfissionalService, public agendamentoService: AgendamentoService) { }

  ngOnInit() {
    let calculo = new CalculoFuncionarioDTO();
    // calculo.grossSalary = this.salarioBase;
    // calculo.healthPlan = this.planoSaude;
    // calculo.mealTicket = this.valeAlimentacao;
    // calculo.otherBenefits = 0;
    // calculo.transportVoucher = this.valeTransporte;

    // this.profissionalService.calcularGastosFuncionario(calculo)
    //   .subscribe(calculo => console.log(calculo))
    let date = new Date();
    this.periodo = date.getMonth();
    this.ano = date.getFullYear();
    this.datasNoMes = DateUtils.datesInMonth(date);
    this.diaSelecionado = this.datasNoMes.length;
    this.pagamentos = [];
    this.salarioBase = 0;

  }

  public recuperarValoresPorAno() {
    let date = new Date();
    date.setDate(1);
    date.setMonth(this.periodo);
    date.setFullYear(this.ano);
    this.datasNoMes = DateUtils.datesInMonth(date);
    this.diaSelecionado = this.datasNoMes.length;

    this.recuperarValores();
  }

  public recuperarValoresPorPeriodo() {
    let date = new Date();
    date.setDate(1);
    date.setMonth(this.periodo);
    date.setFullYear(this.ano);
    this.datasNoMes = DateUtils.datesInMonth(date);
    this.diaSelecionado = this.datasNoMes.length;

    this.recuperarValores();
  }

  public recuperarValores() {
    let date = new Date();
    date.setDate(1);
    date.setMonth(this.periodo);
    date.setFullYear(this.ano);
    this.datasNoMes = DateUtils.datesInMonth(date);
    this.pagamentos = [];
    this.salarioBase = 0;

    this.recalcularValores();
  }

  public recalcularValores() {
    let dataIni = DateUtils.format(this.datasNoMes[0], DateUtils.ES);
    let dataF = DateUtils.format(this.datasNoMes[this.diaSelecionado - 1], DateUtils.ES);
    if (this.profissionalSelecionado) {
      this.profissionalService.recuperarValoresRecebidosProfissionalPorPeriodo(this.profissionalSelecionado.id, dataIni, dataF)
        .subscribe((pagamento: ContraChequeProfissionalDTO) => {
          this.pagamentos = pagamento.pagamentos;
          this.servicos = pagamento.valoresRecebidos;
          this.salarioBase = pagamento.valor ? pagamento.valor : 0;
          this.ehGerente = this.isGerente(this.profissionalSelecionado);

          if (this.ehGerente) {
            this.agendamentoService.recuperarTotais(dataIni, dataF)
              .subscribe((totais: TotaisDTO) => {
                this.totais = totais;
                this.salarioBase = (this.totais.total * this.PORCENTAGEM_GERENTE) + this.VL_FIXO_GERENTE;
                this.planoSaude = 0;
                this.valeTransporte = 0;
                this.valeAlimentacao = 0;
              });
          } else {
            if (this.profissionalSelecionado.contratada) {
              this.salarioBase = this.salarioBasePadrao;
              this.planoSaude = this.planoSaudePadrao;
              this.valeTransporte = this.valeTransportePadrao;
              this.valeAlimentacao = this.valeAlimentacaoPadrao;
            } else {
              this.planoSaude = 0;
              this.valeTransporte = 0;
              this.valeAlimentacao = 0;
            }
          }
          this.calcularHorasTotais();
        });
    } else {
      this.planoSaude = 0;
      this.valeTransporte = 0;
      this.valeAlimentacao = 0;
      this.calcularHorasTotais();
    }
  }

  public addDesconto() {
    if (document !== null && typeof document !== 'undefined' && typeof document !== null) {
      // Obtém a tabela
      const table = document?.getElementById('tabelaDescontos')?.getElementsByTagName('tbody')[0];

      if (table !== null && typeof table !== 'undefined' && typeof table !== null) {
        // Cria uma nova linha
        const newRow = table.insertRow();
        if (newRow !== null && typeof newRow !== 'undefined' && typeof newRow !== null) {
          // Cria as células da nova linha e adiciona conteúdo

          const cell2 = newRow.insertCell(1);
          cell2.textContent = `Nome ${table.rows.length}`;

          const cell3 = newRow.insertCell(2);
          cell3.textContent = `email${table.rows.length}@exemplo.com`;

          // Adiciona a nova linha na tabela
          table.appendChild(newRow);
        }
      }
    }
  }

  public calcularTotais(salarioBase: number): number {
    let total = salarioBase;
    // total += this.calcularINSS(salarioBase);
    // total += this.calcularIRRF(salarioBase);
    total += this.calcularHorasExtras(salarioBase, this.horasExtras);
    total += this.planoSaude;
    total += this.valeAlimentacao;
    total += this.valeTransporte;

    return total;
  }

  public calcularDifHorasTrabalhadas(salarioBase: number): number {
    if (this.horasTrabalhadas < this.horasMensais) {
      return salarioBase - ((salarioBase * this.horasTrabalhadas) / this.horasMensais);
    }

    return 0;
  }

  public calcularHorasTotais(): number {
    let data = this.hoje;
    data.setMonth(this.periodo);

    let total = 0;
    let datas: Date[] = DateUtils.datesInMonth(data);
    datas.forEach(data => {
      const dayOfWeek = DateUtils.toMoment(data).day();// 0 = Domingo, 6 = Sábado
      if (dayOfWeek === 6) {
        total += 4;
      } else if (dayOfWeek === 0) {
        total += 0;
      } else {
        total += 8;
      }
    });

    this.horasMensais = total - (this.numFeriados * 8);
    return this.horasMensais;
  }

  public calcularINSS(salarioBase: number): number {
    let inss: number = 0;

    if (!this.ignorarDescontos && this.profissionalSelecionado && this.profissionalSelecionado.contratada) {
      // if (salarioBase <= 1412.00) {
      //   inss = salarioBase * 0.075;  // 7.5%
      // } else if (salarioBase <= 2666.68) {
      //   inss = salarioBase * 0.09;   // 9%
      // } else if (salarioBase <= 4000.03) {
      //   inss = salarioBase * 0.12;   // 12%
      // } else if (salarioBase <= 7786.49) {
      //   inss = salarioBase * 0.14;   // 14%
      // }

      inss = 109.32;
    }
    return inss;
  }

  // Função para calcular o IRRF
  public calcularIRRF(salarioBase: number): number {
    let irrf = 0;
    if (!this.ignorarDescontos && this.profissionalSelecionado && this.profissionalSelecionado.contratada) {
      const baseIRRF = salarioBase - this.calcularINSS(salarioBase); // Salário após o desconto do INSS

      if (baseIRRF <= 1903.98) {
        irrf = 0; // Isento
      } else if (baseIRRF <= 2826.65) {
        irrf = (baseIRRF - 1903.98) * 0.075 - 142.80; // Dedução de R$ 142,80
      } else if (baseIRRF <= 3751.05) {
        irrf = (baseIRRF - 2826.65) * 0.15 - 354.80; // Dedução de R$ 354,80
      } else if (baseIRRF <= 4664.68) {
        irrf = (baseIRRF - 3751.05) * 0.225 - 636.13; // Dedução de R$ 636,13
      } else {
        irrf = (baseIRRF - 4664.68) * 0.275 - 869.36; // Dedução de R$ 869,36
      }
    }

    // Certificar que o valor do IRRF não seja negativo
    return irrf > 0 ? irrf : 0;
  }

  // Função para calcular o total de descontos (INSS + IRRF)
  public calcularDescontos(salarioBase: number): { inss: number, irrf: number, horasNaoTrabalhadas: number, totalDescontos: number } {
    const inss = this.calcularINSS(salarioBase);
    const irrf = this.calcularIRRF(salarioBase);
    let horasNaoTrabalhadas = 0;
    if (this.profissionalSelecionado && this.profissionalSelecionado.contratada) {
      horasNaoTrabalhadas = this.calcularDifHorasTrabalhadas(salarioBase);
    }

    let totalDesconto = 0;
    this.pagamentos.forEach(pag => totalDesconto += pag.valor ? pag.valor : 0);
    const totalDescontos = inss + irrf + horasNaoTrabalhadas + totalDesconto;
    return { inss, irrf, horasNaoTrabalhadas, totalDescontos };
  }

  // Função para calcular o salário líquido (salário base - descontos)
  public calcularSalarioLiquido(salarioBase: number): number {
    const descontos = this.calcularDescontos(salarioBase);
    return this.calcularTotais(salarioBase) - descontos.totalDescontos;
  }

  public getCargo(profissionalSelecionado: ProfissionalDTO): string {
    let cargo: string = '';
    switch (profissionalSelecionado.tipo) {
      case TipoProfissionalEnum.GERENTE:
        cargo = 'Gerente';
        break;
      default:
        cargo = 'Auxiliar de Limpeza'
        break;
    }

    return cargo;
  }


  public calcularHoraNormal(salarioBase: number): number {
    const horasTrabalhadasPorMes = this.calcularHorasTotais(); // Considerando 44 horas semanais (5 dias de 8 horas)
    return salarioBase / horasTrabalhadasPorMes;
  }

  // Função para calcular o valor das horas extras
  public calcularHorasExtras(salarioBase: number, horasExtras: number): number {
    // Calcula o valor da hora normal
    const valorHoraNormal = this.calcularHoraNormal(salarioBase);

    // Calcula o valor da hora extra (adicional sobre a hora normal)
    const valorHoraExtra = valorHoraNormal * (1 + this.adicionalExtra);

    // Calcula o valor total das horas extras
    const valorTotalHorasExtras = valorHoraExtra * horasExtras;

    return valorTotalHorasExtras;
  }

  getPeriodo(): string {
    let mes: string = "";
    switch (this.periodo) {
      case 0:
        mes = "Janeiro";
        break;
      case 1:
        mes = "Fevereiro";
        break;
      case 2:
        mes = "Março";
        break;
      case 3:
        mes = "Abril";
        break;
      case 4:
        mes = "Maio";
        break;
      case 5:
        mes = "Junho";
        break;
      case 6:
        mes = "Julho";
        break;
      case 7:
        mes = "Agosto";
        break;
      case 8:
        mes = "Setembro";
        break;
      case 9:
        mes = "Outubro";
        break;
      case 10:
        mes = "Novembro";
        break;
      default:
        mes = "Dezembro";
        break;
    }
    return `${mes}/${this.ano}`
  }

  generatePDF() {
    const doc = new jsPDF();
    // Captura o conteúdo HTML de um elemento específico
    const content = document.getElementById('idDemonstrativoPDF'); // ID do conteúdo HTML
    if (content) {
      let date = new Date();
      date.setDate(1);
      date.setMonth(this.periodo);
      date.setFullYear(this.ano);
      let nomeProf = this.profissionalSelecionado?.nome;
      doc.html(content, {
        callback: function (doc: jsPDF) {
          doc.save(`Pagamento_${nomeProf}.pdf`);
        },
        filename: `Pagamento_${nomeProf}_${this.periodo}/${this.ano}.pdf`,
        margin: [10, 10, 10, 10], // Margens do PDF
        html2canvas: {
          scale: 0.1, // Ajusta a escala de renderização para maior qualidade
        }
      });
    }
  }

  public isGerente(profissionalSelecionado: ProfissionalDTO) {
    return profissionalSelecionado?.tipo == TipoProfissionalEnum.GERENTE;
  }
}
