import { DurationInputArg2, MomentInput } from 'moment-timezone';
import moment from 'moment-timezone';
import { InclusividadeEnum } from "../domains/enums/InclusividadeEnum";
import { LinguagemEnum } from "../domains/enums/LinguagemEnum";
import { DiaSemanaEnum } from "../domains/enums/DiaSemanaEnum";

export class DateUtils {
    public static BR: string = "DD/MM/yyyy";
    public static ES: string = "yyyy-MM-DD";
    public static ES_LOCALDATETIME: string = "YYYY-MM-DDTHH:mm:ss.SSSSSS";
    public static TIMEZONE_SAO_PAULO: string = 'America/Sao_Paulo';

    public static toMoment(date?: MomentInput, format?: moment.MomentFormatSpecification, language = LinguagemEnum.PT): moment.Moment {
        if (moment.isMoment(date)) {
            return date;
        }

        if (date && format && language) {
            return moment(date, format, language).tz(this.TIMEZONE_SAO_PAULO);
        }

        if (date && !format) {
            if (moment(date, this.BR, language).isValid()) {
                return moment(date, this.BR).tz(this.TIMEZONE_SAO_PAULO);
            }
        }


        return moment().tz(this.TIMEZONE_SAO_PAULO).locale(LinguagemEnum.PT);
    }

    public static newDate(): Date {
        // const data = this.toMoment().toDate();
        return new Date();
    }

    public static format(date: MomentInput, format: moment.MomentFormatSpecification): string {
        if (moment.isMoment(date)) {
            return date.format(format.toString());
        }

        return this.toMoment(date).format(format.toString());
    }

    public static toDate(date: MomentInput, format?: moment.MomentFormatSpecification): Date {
        if (moment.isMoment(date)) {
            return date.toDate();
        }

        return this.toMoment(date, format).toDate();
    }

    public static subtract(date: MomentInput, amount: number | string, unit: DurationInputArg2): moment.Moment {
        return this.toMoment(date).subtract(amount, unit);
    }

    public static add(date: MomentInput, amount: number | string, unit: DurationInputArg2): moment.Moment {
        return this.toMoment(date).add(amount, unit);
    }

    public static between(date: MomentInput, dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification, inclusivity?: InclusividadeEnum): boolean {
        if (format) {
            return this.toMoment(date, format).isBetween(this.toMoment(dateA, format), this.toMoment(dateB, format));
        }
        return this.toMoment(date).isBetween(dateA, dateB, null, inclusivity);
    }

    public static isBefore(dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification): boolean {
        if (format) {
            return this.toMoment(dateA, format).isBefore(this.toMoment(dateB, format));
        }

        return this.toMoment(dateA).isBefore(dateB);
    }

    public static isSame(dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification): boolean {
        if (format) {
            return this.toMoment(dateA, format).isSame(this.toMoment(dateB, format));
        }

        return this.toMoment(dateA).isSame(dateB);
    }

    public static isAfter(dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification): boolean {
        if (format) {
            return this.toMoment(dateA, format).isAfter(this.toMoment(dateB, format));
        }
        return this.toMoment(dateA).isAfter(dateB);
    }

    public static isSameOrAfter(dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification): boolean {
        if (format) {
            return this.toMoment(dateA, format).isSameOrAfter(this.toMoment(dateB, format));
        }
        return this.toMoment(dateA).isSameOrAfter(dateB);
    }

    public static isSameOrBefore(dateA: MomentInput, dateB: MomentInput, format?: moment.MomentFormatSpecification): boolean {
        if (format) {
            return this.toMoment(dateA, format).isSameOrBefore(this.toMoment(dateB, format));
        }
        return this.toMoment(dateA).isSameOrBefore(dateB);
    }

    public static getNextDays(dateA: MomentInput, qtd: number): Array<Date> {
        const date: MomentInput = this.toMoment(dateA);
        let datesInMonth: Array<Date> = [date.toDate()];

        for (let i = 1; i < qtd; i++) {
            datesInMonth.push(date.add(1, 'day').toDate());
        }

        return datesInMonth;
    }

    public static datesInMonth(dateA: MomentInput): Array<Date> {
        const date: MomentInput = this.toMoment(dateA);
        const daysInMonth: number = date.daysInMonth();
        let datesInMonth: Array<Date> = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const data: Date = date.clone().date(i).toDate();
            datesInMonth.push(data);
        }

        return datesInMonth;
    }

    public static startOfDay(dateA: MomentInput): MomentInput {
        return this.toMoment(dateA).startOf('day');
    }

    public static endOfDay(dateA: MomentInput): MomentInput {
        return this.toMoment(dateA).endOf('day');
    }

    public static diffMinutes(dateA: MomentInput, dateB: MomentInput): number {
        const diffInMs = this.toDate(dateA).getTime() - this.toDate(dateB).getTime(); // Diferença em milissegundos
        return Math.floor(diffInMs / (1000 * 60))
    }

    public static getDiasSemana(dateA: MomentInput) {
        switch (this.toMoment(dateA).day()) {
            case 0:
                return DiaSemanaEnum.DOMINGO;
            case 1:
                return DiaSemanaEnum.SEGUNDA;
            case 2:
                return DiaSemanaEnum.TERCA;
            case 3:
                return DiaSemanaEnum.QUARTA;
            case 4:
                return DiaSemanaEnum.QUINTA;
            case 5:
                return DiaSemanaEnum.SEXTA;
            default:
                return DiaSemanaEnum.SABADO;
        }
    }

}