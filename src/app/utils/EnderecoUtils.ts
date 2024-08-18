import { EnderecoDTO } from "../domains/dtos/EnderecoDTO";

export class EnderecoUtils {

    public static montarEndereco(end: EnderecoDTO) {
        const numero = end.numero ? ` - Numero: ${end.numero}` : ``;
        const complemento = end.complemento ? ` - Complemento: ${end.complemento}` : ``;
        return `${end.logradouro}, ${end.bairro} ${numero} ${complemento} ${end.localidade}/${end.uf} - Cep:${end.cep}`
    }
}