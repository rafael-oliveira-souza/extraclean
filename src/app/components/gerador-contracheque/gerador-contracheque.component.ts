import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MoedaPipe } from '../../pipes/moeda.pipe';
import { ProfissionalService } from '../../services/profissional.service';
import { CalculoFuncionarioDTO } from '../../domains/dtos/CalculoFuncionarioDTO';
import { DateUtils } from '../../utils/DateUtils';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MoedaPipe
  ],
  templateUrl: './gerador-contracheque.component.html',
  styleUrls: ['./gerador-contracheque.component.scss']
})
export class GeradorContrachequeComponent implements OnInit {

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];

  public hoje: Date = new Date();
  public periodo: number = this.hoje.getMonth();
  public horasExtras: number = 0;
  public salarioBase: number = 1450;
  public planoSaude: number = 0;
  public numFeriados: number = 0;
  public valeTransporte: number = 405;
  public valeAlimentacao: number = 195;
  public profissionalSelecionado!: ProfissionalDTO;
  public adicionalExtra = 1; // Adicional de 50% para horas extras durante a semana
  public horasMensais: number = this.calcularHorasTotais();
  public horasTrabalhadas: number = this.horasMensais;
  public ignorarDescontos: boolean = false;

  constructor(public profissionalService: ProfissionalService) { }

  ngOnInit() {
    let calculo = new CalculoFuncionarioDTO();
    calculo.grossSalary = this.salarioBase;
    calculo.healthPlan = this.planoSaude;
    calculo.mealTicket = this.valeAlimentacao;
    calculo.otherBenefits = 0;
    calculo.transportVoucher = this.valeTransporte;

    // this.profissionalService.calcularGastosFuncionario(calculo)
    //   .subscribe(calculo => console.log(calculo))
  }

  public calcularTotais(salarioBase: number): number {
    let total = salarioBase;
    total += this.calcularINSS(salarioBase);
    total += this.calcularIRRF(salarioBase);
    total += this.calcularHorasExtras(salarioBase, this.horasExtras);
    total += this.planoSaude;
    total += this.valeAlimentacao;
    total += this.valeTransporte;

    return total;
  }

  public calcularDifHorasTrabalhadas(salarioBase: number): number {
    if (this.horasTrabalhadas < this.horasMensais) {
      return (salarioBase * this.horasTrabalhadas) / this.horasMensais;
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

    if (!this.ignorarDescontos) {
      if (salarioBase <= 1412.00) {
        inss = salarioBase * 0.075;  // 7.5%
      } else if (salarioBase <= 2666.68) {
        inss = salarioBase * 0.09;   // 9%
      } else if (salarioBase <= 4000.03) {
        inss = salarioBase * 0.12;   // 12%
      } else if (salarioBase <= 7786.49) {
        inss = salarioBase * 0.14;   // 14%
      }
    }
    return inss;
  }

  // Função para calcular o IRRF
  public calcularIRRF(salarioBase: number): number {
    let irrf = 0;
    if (!this.ignorarDescontos) {
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
    const horasNaoTrabalhadas = this.calcularDifHorasTrabalhadas(salarioBase);
    const totalDescontos = inss + irrf + horasNaoTrabalhadas;
    return { inss, irrf, horasNaoTrabalhadas, totalDescontos };
  }

  // Função para calcular o salário líquido (salário base - descontos)
  public calcularSalarioLiquido(salarioBase: number): number {
    const descontos = this.calcularDescontos(salarioBase);
    return this.calcularTotais(salarioBase) - descontos.totalDescontos;
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
    return `${mes}/${this.hoje.getFullYear()}`
  }

}
