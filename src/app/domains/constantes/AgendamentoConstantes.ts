import { NumberUtils } from "../../utils/NumberUtils";
import { TurnoEnum } from "../enums/TurnoEnum";

export class AgendamentoConstantes {
    public static VALOR_PROFISSIONAL_SELECIONADO = 20;
    public static VALOR_DESLOCAMENTO = 25;
    public static VALOR_DIARIA_DETALHADA = 1.5;
    public static VALOR_PADRAO_METRO = 2.0;
    public static MAX_PERCENTUAL = 15;
    public static PERCENTUAL_DESCONTO = 2;
    public static METRAGEM_MIN = 15;
    public static METRAGEM_MAX = 1000;

    public static calcularTotal(valorMetro: number, metragem: number, qtdDias: number, porcentagem: number,
        profissionalSelecionado: boolean, isDetalhada: boolean, turno: TurnoEnum): number {
        let valorTotal = 0;

        if (qtdDias && valorMetro && metragem) {
            valorTotal += qtdDias * NumberUtils.arredondarCasasDecimais(valorMetro, 2) * metragem;
        }

        if (profissionalSelecionado) {
            if (qtdDias > 0) {
                valorTotal += AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO * qtdDias;
            } else {
                valorTotal += AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
            }
        }

        if (isDetalhada) {
            valorTotal *= AgendamentoConstantes.VALOR_DIARIA_DETALHADA;
        }

        if (turno == TurnoEnum.INTEGRAL) {
            valorTotal *= 2;
        }

        if (qtdDias > 1) {
            valorTotal += AgendamentoConstantes.VALOR_DESLOCAMENTO * qtdDias;
            valorTotal = this.aplicarDesconto(valorTotal, porcentagem);
        }

        return valorTotal;
    }

    private static aplicarDesconto(valor: number, percentual: number) {
        let desconto = 0;
        if (valor > 0 && percentual > 0) {
            desconto = this.calcularDesconto(valor, percentual);
        }

        return valor - desconto
    }

    private static calcularDesconto(valor: number, percentual: number) {
        let desconto = 0;
        if (percentual > AgendamentoConstantes.MAX_PERCENTUAL) {
            percentual = AgendamentoConstantes.MAX_PERCENTUAL;
        }

        if (valor > 0 && percentual > 0) {
            desconto = valor * percentual / 100;
        }

        return desconto;
    }
}