export class NumberUtils {
    public static arredondarCasasDecimais(value: number, decimalPlaces: number): number {
        const factor = Math.pow(10, decimalPlaces);
        return Math.round(value * factor) / factor;
    }
}