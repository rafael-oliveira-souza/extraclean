import { PlanosComponent } from "../../tabs/planos/planos.component";
import { AgendamentoPagamentoInfoDTO } from "../dtos/AgendamentoPagamentoInfoDTO";
import { HorasDTO } from "../dtos/HorasDTO";
import { PlanoDTO } from "../dtos/PlanoDTO";
import { HorasEnum } from "../enums/HorasEnum";
import { TurnoEnum } from "../enums/TurnoEnum";

export class AgendamentoConstantes {
    public static VALOR_PRODUTOS = 15;
    public static VALOR_PROFISSIONAL_SELECIONADO = 20;
    public static VALOR_DIARIA_DETALHADA = 1.5;
    public static VALOR_DESLOCAMENTO = 15;
    public static VALOR_PADRAO_METRO = 2.0;
    public static MAX_PERCENTUAL = 18;
    public static PERCENTUAL_DESCONTO = 2;
    public static METRAGEM_MIN = 15;
    public static METRAGEM_MAX = 1000;

    public static VALORES_HORAS: HorasDTO[] = [
        { id: HorasEnum.HORAS_4, valor: 125, descricao: '4 Horas - 1 Profissional', numProfissionais: 1 },
        { id: HorasEnum.HORAS_6, valor: 155, descricao: '6 Horas - 1 Profissional', numProfissionais: 1 },
        { id: HorasEnum.HORAS_8, valor: 190, descricao: '8 Horas - 1 Profissional', numProfissionais: 1 },
        { id: HorasEnum.HORAS_16, valor: 360, descricao: '8 Horas - 2 Profissionais', numProfissionais: 2 },
        { id: HorasEnum.HORAS_24, valor: 495, descricao: '8 Horas - 3 Profissionais', numProfissionais: 3 },
    ];

    public static REGIOES: { id: number, nome: string, adicional: number }[] = [
        { id: 1, nome: "Águas Claras", adicional: 0 },
        { id: 2, nome: "Arniqueira", adicional: 0 },
        { id: 3, nome: "Candangolândia", adicional: 10 },
        { id: 4, nome: "Ceilândia", adicional: 0 },
        { id: 5, nome: "Cruzeiro", adicional: 10 },
        { id: 6, nome: "Guará", adicional: 5 },
        { id: 7, nome: "Lago Sul", adicional: 25 },
        { id: 8, nome: "Lago Norte", adicional: 25 },
        { id: 9, nome: "Núcleo Bandeirante", adicional: 10 },
        { id: 10, nome: "Plano Piloto	", adicional: 10 },
        { id: 11, nome: "Recanto das Emas", adicional: 10 },
        { id: 12, nome: "Riacho Fundo", adicional: 0 },
        { id: 13, nome: "Samambaia", adicional: 10 },
        { id: 14, nome: "SIA	", adicional: 10 },
        { id: 15, nome: "Sudoeste/Octogonal", adicional: 10 },
        { id: 16, nome: "Taguatinga", adicional: 0 },
        { id: 17, nome: "Vicente Pires", adicional: 0 }
    ];

    public static getInfoHora(horaEnum: string | number | HorasEnum): HorasDTO {
        const filtro: HorasDTO[] = this.VALORES_HORAS.filter(hora => hora.id == horaEnum || hora.descricao == horaEnum || hora.valor == horaEnum);
        return filtro.length > 0 ? filtro[0] : new HorasDTO();
    }

    public static getValorHora(horaEnum: HorasEnum): number {
        return this.getInfoHora(horaEnum).valor;
    }

    private static calcularValorPago(valor: number, numProfissionais: number, porcentagemProfissionais: number) {
        return valor / numProfissionais * porcentagemProfissionais / 100;
    }

    public static calcularPorcentagemDias(qtdDias: number = 1) {
        if (qtdDias == null || qtdDias <= 1) {
            return 0;
        }

        let desconto: number = 0;
        const ultPlano: PlanoDTO = PlanosComponent.PLANOS[PlanosComponent.PLANOS.length - 1];
        for (let i = 1; i < PlanosComponent.PLANOS.length; i++) {
            let planoAnt: PlanoDTO = PlanosComponent.PLANOS[i - 1];
            let planoProx: PlanoDTO = PlanosComponent.PLANOS[i];
            if (qtdDias >= planoAnt.qtdDias && qtdDias < planoProx.qtdDias) {
                desconto = planoAnt.desconto;
            } else if (qtdDias >= ultPlano.qtdDias) {
                desconto = ultPlano.desconto;
            }
        }

        return desconto;
    }

    public static calcularTotalPorHora(valorHoras: HorasEnum, qtdDias: number = 1, extraPlus: boolean = false,
        porcentagemDesconto: number = 0, turno: TurnoEnum = TurnoEnum.NAO_DEFINIDO): AgendamentoPagamentoInfoDTO {
        const porcentagemProfissionalInicial = 60;

        // if (qtdDias == 0) {
        //     qtdDias = 1;
        // }
        const horasFiltradas: HorasDTO[] = this.VALORES_HORAS.filter(horaObj => horaObj.id == valorHoras);
        let info: AgendamentoPagamentoInfoDTO = new AgendamentoPagamentoInfoDTO();
        info.turno = turno;
        info.valor = horasFiltradas ? horasFiltradas[0].valor : 0;

        if (valorHoras == HorasEnum.HORAS_4) {
            info.metragem = 50;
            info.numProfissionais = 1;
        } else if (valorHoras == HorasEnum.HORAS_6) {
            info.metragem = 80;
            info.numProfissionais = 1;
        } else if (valorHoras == HorasEnum.HORAS_8) {
            info.metragem = 120;
            info.numProfissionais = 1;
        } else if (valorHoras == HorasEnum.HORAS_16) {
            info.metragem = 200;
            info.numProfissionais = 2;
        } else if (valorHoras == HorasEnum.HORAS_24) {
            info.metragem = 270;
            info.numProfissionais = 3;
        }

        if (extraPlus) {
            info.valor += this.VALOR_PROFISSIONAL_SELECIONADO;
            info.valor *= qtdDias;
        } else {
            info.valor *= qtdDias;
        }

        info.desconto = this.aplicarDesconto(info.valor, porcentagemDesconto);
        info.total = info.valor - info.desconto;
        info.horas = valorHoras;
        info.porcentagemProfissionais = porcentagemProfissionalInicial;
        let ajusteValorPorcentagem = this.calcularValorPago(info.total, info.numProfissionais, info.porcentagemProfissionais);

        info.valorProfissionais = ajusteValorPorcentagem;
        return info;
    }

    public static calcularTotal(metragem: number, isDetalhada: boolean, qtdDias: number = 1, porcentagemDesconto: number = 0,
        profissionalSelecionado: boolean = false, turno: TurnoEnum = TurnoEnum.NAO_DEFINIDO): AgendamentoPagamentoInfoDTO {
        const metragemInicial = 60;
        const valorInicial = this.VALORES_HORAS[0].valor;
        const maxMetroPorProf = 140;
        const aumentoACadaMetro = 12.5;
        const relacaoMetroValor = 10;
        const valorMinimoPagoProfissional = 60;
        const porcentagemProfissionalInicial = 65;

        let info: AgendamentoPagamentoInfoDTO = new AgendamentoPagamentoInfoDTO();
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
            info.valor = (info.valor + info.valorProfissionais);
            info.numProfissionais++;
        }

        if (profissionalSelecionado) {
            info.valor += this.VALOR_PROFISSIONAL_SELECIONADO * qtdDias;
        }

        info.desconto = this.aplicarDesconto(info.valor, porcentagemDesconto);
        info.total = info.valor - info.desconto;
        return info;
    }

    public static aplicarDesconto(valor: number, percentual: number) {
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