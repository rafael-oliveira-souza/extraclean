import { NumberUtils } from "../../utils/NumberUtils";
import { AgendamentoInfoDTO } from "../dtos/AgendamentoInfoDTO";
import { TurnoEnum } from "../enums/TurnoEnum";

export class AgendamentoConstantes {
    public static VALOR_PROFISSIONAL_SELECIONADO = 20;
    public static VALOR_DESLOCAMENTO = 15;
    public static VALOR_DIARIA_DETALHADA = 1.5;
    public static VALOR_PADRAO_METRO = 2.0;
    public static MAX_PERCENTUAL = 25;
    public static PERCENTUAL_DESCONTO = 2;
    public static METRAGEM_MIN = 15;
    public static METRAGEM_MAX = 1000;

    private static calcularValorPago(valor: number, numProfissionais: number, porcentagemProfissionais: number) {
        return valor / numProfissionais * porcentagemProfissionais / 100;
    }

    public static calcularTotal(metragem: number, isDetalhada: boolean, qtdDias: number = 1, porcentagemDesconto: number = 0,
        profissionalSelecionado: boolean = false, turno: TurnoEnum = TurnoEnum.NAO_DEFINIDO): AgendamentoInfoDTO {
        const metragemInicial = 60;
        const valorInicial = 110;
        const maxMetroPorProf = 140;
        const aumentoACadaMetro = 12.5;
        const relacaoMetroValor = 10;
        const valorMinimoPagoProfissional = 65;
        const porcentagemProfissionalInicial = 65;

        let info: AgendamentoInfoDTO = new AgendamentoInfoDTO();
        info.metragem = metragem;
        info.valor = valorInicial;
        info.numProfissionais = 1;
        info.turno = turno;

        for (let i = metragemInicial; i < metragem; i += relacaoMetroValor) {
            info.valor += aumentoACadaMetro;
        }

        while ((info.numProfissionais * maxMetroPorProf) < metragem) {
            info.numProfissionais++;
        }

        info.porcentagemProfissionais = porcentagemProfissionalInicial;
        let ajusteValorPorcentagem = this.calcularValorPago(info.valor, info.numProfissionais, info.porcentagemProfissionais);
        while (ajusteValorPorcentagem < valorMinimoPagoProfissional) {
            info.porcentagemProfissionais += 0.5;
            ajusteValorPorcentagem = this.calcularValorPago(info.valor, info.numProfissionais, info.porcentagemProfissionais);
        }

        info.valor *= qtdDias;
        info.valorProfissionais = ajusteValorPorcentagem;
        if (isDetalhada) {
            info.valor += info.valorProfissionais;
            info.numProfissionais++;
        }

        if (profissionalSelecionado) {
            info.valor += this.VALOR_PROFISSIONAL_SELECIONADO;
        }

        info.desconto = this.aplicarDesconto(info.valor, porcentagemDesconto);
        info.total = info.valor - info.desconto;
        return info;
    }

    private static aplicarDesconto(valor: number, percentual: number) {
        let desconto = 0;
        if (valor > 0 && percentual > 0) {
            desconto = this.calcularDesconto(valor, percentual);
        }

        return desconto
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