export class LocalStorageUtils {
    // Padrao TTL de 30 minutos (1800000 ms)
    public static readonly TTL: number = 1800000;
    public static readonly USUARIO_CACHE_EMAIL: string = "XXXX_USUARIO_CACHE_EMAIL_XXXX";

    static setUsuario(email: string, ttl: number = this.TTL): void {
        this.setItem(this.USUARIO_CACHE_EMAIL, email, ttl);
    }

    static getUsuario(): string | null {
        return this.getItem(this.USUARIO_CACHE_EMAIL);
    }

    // Método para salvar um item no localStorage com TTL
    static setItem<T>(key: string, value: T, ttl: number = this.TTL): void {
        const now = new Date().getTime();
        const item: CachedItem<T> = {
            value: value,
            expiry: now + ttl,
        };

        try {
            const serializedValue = JSON.stringify(item);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Erro ao salvar o item no localStorage: ${error}`);
        }
    }

    // Método para obter um item do localStorage, validando o TTL
    static getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsedItem: CachedItem<T> = JSON.parse(item);
            const now = new Date().getTime();

            if (now > parsedItem.expiry) {
                // Item expirou, remover do localStorage
                localStorage.removeItem(key);
                return null;
            }

            return parsedItem.value;
        } catch (error) {
            console.error(`Erro ao obter o item do localStorage: ${error}`);
            return null;
        }
    }

    // Método para remover um item do localStorage
    static removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Erro ao remover o item do localStorage: ${error}`);
        }
    }

    // Método para limpar todos os itens do localStorage
    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Erro ao limpar o localStorage: ${error}`);
        }
    }
}

interface CachedItem<T> {
    value: T;
    expiry: number;
}