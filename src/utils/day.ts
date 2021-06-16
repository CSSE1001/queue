import startOfISOWeek from "date-fns/startOfISOWeek";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { IsoDay, IsoDayFormatting } from "../types/day";

export const isoNumberToDay = (
    isoDay: IsoDay,
    isoDayFormat: IsoDayFormatting = "iii"
): string => {
    const monday = startOfISOWeek(new Date());
    const weekDay = addDays(monday, isoDay - 1);
    return format(weekDay, isoDayFormat);
};
