import { EnderecoDTO } from "../domains/dtos/EnderecoDTO";

export class EnderecoUtils {

    public static montarEndereco(end: EnderecoDTO) {
        const numero = end.numero ? ` - Numero: ${end.numero}` : ``;
        const complemento = end.complemento ? ` - Complemento: ${end.complemento}` : ``;
        return `${end.logradouro}, ${end.bairro} ${numero} ${complemento} ${end.localidade}/${end.uf} - Cep:${end.cep}`
    }

    public static montarEnderecoPorValores(logradouro: string, numero: string, cep: string): EnderecoDTO {
        let end: EnderecoDTO = new EnderecoDTO();
        end.cep = cep;
        end.numero = numero;
        end.bairro = logradouro;
        end.logradouro = logradouro;
        end.logradouro = logradouro;
        end.uf = "DF";
        end.valido = true

        return end;
    }
}