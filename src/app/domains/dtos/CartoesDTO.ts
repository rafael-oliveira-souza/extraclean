export interface Flashcard {
    pergunta: string;
    resposta: string;
    visto: boolean;
}

export class CartoesDTO {
    public flashs: Map<string, Flashcard[]> = new Map();

    public addFlashcard(tema: string, flashcard: Flashcard): void {
        const lista = this.flashs.get(tema) || [];
        lista.push(flashcard);
        this.flashs.set(tema, lista);
    }

    public getFlashcards(tema: string): Flashcard[] {
        return this.flashs.get(tema) || [];
    }
}
