
export class WindowsUtils {

    public static copyText(text: string): void {
        navigator.clipboard.writeText(text).then(
            () => {
                console.log('Texto copiado al portapapeles');
            },
            (err) => {
                console.error('Error al copiar el texto: ', err);
            }
        );
    }
}