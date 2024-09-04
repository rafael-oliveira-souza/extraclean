
export class CalculoUtils {

    public static isLessThan(width: number | null, value: number): boolean {
        return width != null && width < value;
    }

    public static isXs(width: number | null): boolean {
        return width != null && width < 768;
    }

    public static isSm(width: number | null): boolean {
        return width != null && width >= 768 && width < 992;
    }

    public static isMd(width: number | null): boolean {
        return width != null && width >= 992 && width < 1200;
    }

    public static isLg(width: number | null): boolean {
        return width != null && width >= 1200;
    }

}