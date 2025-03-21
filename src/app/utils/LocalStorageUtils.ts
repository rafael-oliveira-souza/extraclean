import { AgendamentoDTO } from "../domains/dtos/AgendamentoDTO";
import { AutenticacaoDTO } from "../domains/dtos/AutenticacaoDTO";
import { ClienteDTO } from "../domains/dtos/ClienteDTO";
import { DateUtils } from "./DateUtils";

export class LocalStorageUtils {
    // Padrao TTL de 30 minutos (1800000 ms)
    public static readonly TTL: number = 21600000; // 6 Horas em milisegundos
    public static readonly USUARIO_CACHE_EMAIL: string = "XXXX_USUARIO_CACHE_EMAIL_XXXX";
    public static readonly USUARIO_CACHE_AUTH: string = "XXXX_USUARIO_CACHE_AUTH_XXXX";
    public static readonly USUARIO_CACHE_CLIENTE: string = "XXXX_USUARIO_CACHE_CLIENTE_XXXX";
    public static readonly USUARIO_CACHE_CARRINHO_AGENDAMENTO: string = "XXXX_USUARIO_CACHE_CARRINHO_AGENDAMENTO_XXXX";

    static removeCacheAutenticacao(): void {
        this.removeItem(this.USUARIO_CACHE_AUTH);
        this.removeItem(this.USUARIO_CACHE_EMAIL);
        this.removeItem(this.USUARIO_CACHE_CLIENTE);
        this.removeItem(this.USUARIO_CACHE_CARRINHO_AGENDAMENTO);
    }

    static setAuth(auth: AutenticacaoDTO, ttl: number = this.TTL): void {
        this.setItem(this.USUARIO_CACHE_AUTH, auth, ttl);
    }

    static getAuth(): AutenticacaoDTO | null {
        return this.getItem(this.USUARIO_CACHE_AUTH);
    }

    static setCliente(auth: ClienteDTO, ttl: number = this.TTL): void {
        this.setItem(this.USUARIO_CACHE_CLIENTE, auth, ttl);
    }

    static getCliente(): ClienteDTO | null {
        return this.getItem(this.USUARIO_CACHE_CLIENTE);
    }

    static setAgendamento(agend: AgendamentoDTO, ttl: number = this.TTL): void {
        this.setItem(this.USUARIO_CACHE_CARRINHO_AGENDAMENTO, agend, ttl);
    }

    static getAgendamento(): AgendamentoDTO {
        let agendamento: AgendamentoDTO | null = this.getItem(this.USUARIO_CACHE_CARRINHO_AGENDAMENTO);
        if (agendamento) {
            return Object.assign(new AgendamentoDTO(), agendamento);
        }

        return new AgendamentoDTO();
    }

    // Método para salvar um item no localStorage com TTL
    static setItem<T>(key: string, value: T, ttl: number = this.TTL): void {
        const now = DateUtils.newDate().getTime();
        const item: CachedItem<T> = {
            value: value,
            expiry: now + ttl,
        };

        try {
            if (this.existLocalStorage()) {
                const serializedValue = JSON.stringify(item);
                localStorage.setItem(key, serializedValue);
            }
        } catch (error) {
            console.error(`Erro ao salvar o item no localStorage: ${error}`);
        }
    }

    // Método para obter um item do localStorage, validando o TTL
    static getItem<T>(key: string): T | null {
        try {
            if (this.existLocalStorage()) {
                const item = localStorage.getItem(key);
                if (!item) {
                    return null;
                }

                const parsedItem: CachedItem<T> = JSON.parse(item);
                const now = DateUtils.newDate().getTime();

                if (now > parsedItem.expiry) {
                    // Item expirou, remover do localStorage
                    localStorage.removeItem(key);
                    return null;
                }

                return parsedItem.value;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao obter o item do localStorage: ${error}`);
            return null;
        }
    }

    // Método para remover um item do localStorage
    static removeItem(key: string): void {
        try {
            if (this.existLocalStorage()) {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Erro ao remover o item do localStorage: ${error}`);
        }
    }

    // Método para limpar todos os itens do localStorage
    static clear(): void {
        try {
            if (this.existLocalStorage()) {
                localStorage.clear();
            }
        } catch (error) {
            console.error(`Erro ao limpar o localStorage: ${error}`);
        }
    }

    private static existLocalStorage() {
        return typeof window !== "undefined";
    }
}

interface CachedItem<T> {
    value: T;
    expiry: number;
}