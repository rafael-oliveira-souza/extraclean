import { DurationInputArg2, MomentInput } from "moment";
import moment from "moment";

export class DateUtils {

    public static toMoment(date?: MomentInput, format?: moment.MomentFormatSpecification, language?: string): moment.Moment {
        if (date && format && language) {
            return moment(date, format, language);
        }

        if (date && format) {
            return moment(date, format);
        }

        if (date) {
            return moment(date);
        }

        return moment();
    }

    public static newDate(): Date {
        return this.toMoment().toDate();
    }

    public static format(date: MomentInput, format: moment.MomentFormatSpecification): string {
        return this.toMoment(date, format).format();
    }

    public static toDate(date: MomentInput, format?: moment.MomentFormatSpecification): Date {
        return this.toMoment(date, format).toDate();
    }

    public static subtract(date: MomentInput, amount: number | string, unit: DurationInputArg2): Date {
        return this.toMoment(date).subtract(amount, unit).toDate();
    }

    public static add(date: MomentInput, amount: number | string, unit: DurationInputArg2): Date {
        return this.toMoment(date).add(amount, unit).toDate();
    }
}