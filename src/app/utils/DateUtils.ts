import { DurationInputArg2, MomentInput } from "moment";
import moment from "moment";
import { InclusividadeEnum } from "../domains/enums/InclusividadeEnum";
import { LinguagemEnum } from "../domains/enums/LinguagemEnum";

export class DateUtils {
    public static BR: string = "DD/MM/yyyy";
    public static ES: string = "yyyy-MM-DD";
    public static ES_LOCALDATETIME: string = "YYYY-MM-DDTHH:mm:ss.SSSSSS";

    public static toMoment(date?: MomentInput, format?: moment.MomentFormatSpecification, language = LinguagemEnum.PT): moment.Moment {
        if (date && format && language) {
            return moment(date, format, language);
        }

        if (date && !format) {
            if (moment(date, this.BR, language).isValid()) {
                return moment(date, this.BR);
            }
        }


        return moment().locale(LinguagemEnum.PT);
    }
    public static newDate(): Date {
        return this.toMoment().toDate();
    }

    public static format(date: MomentInput, format: moment.MomentFormatSpecification): string {
        return this.toMoment(date).format(format.toString());
    }

    public static toDate(date: MomentInput, format?: moment.MomentFormatSpecification): Date {
        return this.toMoment(date, format).toDate();
    }

    public static subtract(date: MomentInput, amount: number | string, unit: DurationInputArg2): moment.Moment {
        return this.toMoment(date).subtract(amount, unit);
    }

    public static add(date: MomentInput, amount: number | string, unit: DurationInputArg2): moment.Moment {
        return this.toMoment(date).add(amount, unit);
    }

    public static between(date: MomentInput, dateA: MomentInput, dateB: MomentInput, inclusivity?: InclusividadeEnum): boolean {
        return this.toMoment(date).isBetween(dateA, dateB, null, inclusivity);
    }

    public static isBefore(dateA: MomentInput, dateB: MomentInput): boolean {
        return this.toMoment(dateA).isBefore(dateB);
    }

    public static isSame(dateA: MomentInput, dateB: MomentInput): boolean {
        return this.toMoment(dateA).isSame(dateB);
    }

    public static isAfter(dateA: MomentInput, dateB: MomentInput): boolean {
        return this.toMoment(dateA).isAfter(dateB);
    }

    public static isSameOrAfter(dateA: MomentInput, dateB: MomentInput): boolean {
        return this.toMoment(dateA).isSameOrAfter(dateB);
    }

    public static isSameOrBefore(dateA: MomentInput, dateB: MomentInput): boolean {
        return this.toMoment(dateA).isSameOrBefore(dateB);
    }

    public static datesInMonth(dateA: MomentInput): Array<Date> {
        const date: MomentInput = this.toMoment(dateA);
        const daysInMonth: number = date.daysInMonth();
        let datesInMonth: Array<Date> = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const day: Date = this.toMoment().date(i).month(date.month()).year(date.year()).toDate();
            datesInMonth.push(day);
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

}