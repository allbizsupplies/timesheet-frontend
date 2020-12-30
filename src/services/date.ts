import { DateTime } from "luxon";
import { Shift, ShiftTimes, Timesheet } from "types";

/**
 * Add week to a Date.
 *
 * @param date
 */
export const addWeek = (date: Date) => {
  return addDays(date, 7);
};

/**
 * Subtract week from a Date.
 *
 * @param date
 */
export const subtractWeek = (date: Date) => {
  return addDays(date, -7);
};

/**
 * Add days to a Date.
 *
 * @param date
 * @param days
 */
export const addDays = (date: Date, days: number) => {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Add hours to a Date
 *
 * @param date
 * @param hours
 */
export const addHours = (date: Date, hours: number) => {
  var newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

/**
 * Add hours to a Date
 *
 * @param date
 * @param hours
 */
export const addMinutes = (date: Date, minutes: number) => {
  var newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

/**
 * Gets the start of the week that the date belongs to.
 *
 * @param date   The date to count back from.
 * @param firstDayOfWeek   The first day of the week, where 0 = Sunday.
 * @return date  The date of the start of the week.
 */
export const startOfWeek = (date: Date, firstDayOfWeek: number) => {
  const day = date.getDay();
  const newDate = addDays(date, firstDayOfWeek - day);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Gets the end of the week that the date belongs to.
 *
 * @param date   The date to count forward from.
 * @param firstDayOfWeek   The first day of the week, where 0 = Sunday.
 * @return date  The date of the end of the week.
 */
export const endOfWeek = (date: Date, firstDayOfWeek: number) => {
  const day = date.getDay();
  const newDate = addDays(date, firstDayOfWeek - day + 7);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Gets the Australian English day name.
 *
 * @param date
 */
export const getDayName = (date: Date) =>
  date.toLocaleDateString("en-AU", { weekday: "long" });

/**
 * Gets the Australian English day name.
 *
 * @param number the day of the week, where Sunday is 0.
 */
export const getWeekdayName = (number: number) =>
  [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][number];

/**
 * Gets the Australian English month name.
 *
 * @param date
 */
function getMonthName(date: Date) {
  return date.toLocaleDateString("en-AU", { month: "long" });
}

/**
 * Converts date to string in format DD-MM-YYYY
 *
 * @param date  The date to format
 *
 * @return string  The formatted date.
 */
export const formattedDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

/**
 * Converts date to string in format DD-MM-YYYY
 *
 * @param date  The date to format
 *
 * @return string  The formatted date.
 */
export const longFormatDate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const monthName = getMonthName(date);
  const day = date.getDate().toString().padStart(2, "0");
  const dayName = getDayName(date);

  return `${dayName} ${day} ${monthName} ${year}`;
};

/**
 * A class for storing a time with only hours and minutes.
 */
export class Time {
  hours: number | null;
  minutes: number | null;

  /**
   * @param hours    The hours value for the time
   * @param minutes  The minutes value for the time
   */
  constructor(hours: number | string | null, minutes: number | string | null) {
    this.hours = Time.parseValue(hours);
    this.minutes = Time.parseValue(minutes);
    this.validate();
  }

  static parseValue(value: string | number | null) {
    if (typeof value === "string") {
      return value === "" ? null : parseInt(value);
    }
    return value;
  }

  static validateValue(value: number | null) {
    if (value === null) {
      return true;
    }

    return value >= 0;
  }

  validate() {
    if (this.hours !== null) {
      if (isNaN(this.hours)) {
        throw new InvalidTimeException(`hours contains an invalid value`);
      }

      if (this.hours < 0 || this.hours >= 24) {
        throw new InvalidTimeException(`hours must be between 0 and 23`);
      }
    }

    if (this.minutes !== null) {
      if (isNaN(this.minutes)) {
        throw new InvalidTimeException(`minutes contains an invalid value`);
      }

      if (this.minutes < 0 || this.minutes >= 60) {
        throw new InvalidTimeException(`minutes must be between 0 and 59`);
      }
    }
  }

  /**
   * Creates a Time object from a Date.
   *
   * @param value  The Date input value
   *
   * @return  The Time object.
   */
  static fromDate(value: Date) {
    return new Time(value.getHours(), value.getMinutes());
  }

  /**
   * Creates a Time object from a string.
   *
   * @param value  The string input value, in format HH:MM
   *
   * @return  The Time object.
   */
  static fromString(value: string) {
    const components = value.split(":");
    if (components.length !== 2) {
      throw new InvalidTimeException(`${value} is not formatted as HH:MM`);
    }

    const hours = parseInt(components[0]);
    const minutes = parseInt(components[1]);

    return new Time(hours, minutes);
  }

  /**
   * Creates a Time object from a plain object.
   *
   * @param value  The object input value, with hours and minutes properties.
   *
   * @return  The Time object.
   */
  static fromObject(value: { hours: string; minutes: string }) {
    const hours = parseInt(value.hours);
    const minutes = parseInt(value.minutes);
    return new Time(hours, minutes);
  }

  /**
   * Creates a Time object from an arbitrary number of minutes.
   */
  static fromMinutes(totalMinutes: number) {
    const totalHours = Math.floor(totalMinutes / 60);
    return new Time(totalHours % 24, totalMinutes % 60);
  }

  /**
   * Checks if the time is null.
   */
  isNull() {
    return this.hours === null && this.minutes === null;
  }

  /**
   * Returns the time as a string formatted as HH:MM.
   *
   * @return  The formatted time string.
   */
  toString() {
    const hours = this.hours ? this.hours.toString().padStart(2, "0") : "00";
    const minutes = this.minutes
      ? this.minutes.toString().padStart(2, "0")
      : "00";
    return `${hours}:${minutes}`;
  }

  /**
   * Returns the time as a array of numbers
   *
   * @return  An array containing the hours and minutes values.
   */
  toArray() {
    return [this.hours, this.minutes];
  }

  /**
   * Create a date with this time and the given date.
   *
   * @param date
   */
  toDate(date: Date) {
    const hours = this.hours || 0;
    const minutes = this.minutes || 0;
    return addMinutes(addHours(date, hours), minutes);
  }

  /**
   * Create a DateTime object with this time and the given date.
   *
   * @param date
   */
  toDateTime(date: Date) {
    return DateTime.fromObject({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: this.hours || 0,
      minute: this.minutes || 0,
      second: 0,
      millisecond: 0,
    });
  }

  /**
   * Get this time in minutes.
   */
  toMinutes() {
    const thisHours = this.hours || 0;
    const thisMinutes = this.minutes || 0;
    return thisHours * 60 + thisMinutes;
  }

  /**
   * Get this time in hours.
   */
  toHours() {
    const thisHours = this.hours || 0;
    const thisMinutes = this.minutes || 0;
    return thisHours + thisMinutes / 60;
  }

  /**
   * Adds the given time to this time.
   */
  add(time: Time) {
    const totalMinutes = this.toMinutes() + time.toMinutes();
    return Time.fromMinutes(totalMinutes);
  }

  /**
   * Subtract the given time from this time.
   */
  subtract(time: Time) {
    let diffInMinutes = this.toMinutes() - time.toMinutes();
    return Time.fromMinutes(
      diffInMinutes >= 0 ? diffInMinutes : diffInMinutes + 24 * 60
    );
  }
}

export class InvalidTimeException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidTimeException.prototype);
  }
}

/**
 * Calculates a shift duration in hours from a set of times.
 *
 * @param shiftTimes
 */
export const getShiftHoursFromTimes = (shiftTimes: ShiftTimes) => {
  const startTime = new Time(
    shiftTimes.startTime.hours,
    shiftTimes.startTime.minutes
  );
  const endTime = new Time(
    shiftTimes.endTime.hours,
    shiftTimes.endTime.minutes
  );
  const breakDuration = new Time(
    shiftTimes.breakDuration.hours,
    shiftTimes.breakDuration.minutes
  );

  if (startTime.isNull() || endTime.isNull() || breakDuration.isNull()) {
    return null;
  }

  const shiftMinutes =
    endTime.toMinutes() - startTime.toMinutes() - breakDuration.toMinutes();
  if (shiftMinutes <= 0) {
    return 0;
  }

  return Time.fromMinutes(shiftMinutes).toHours();
};

/**
 * Calculates a shift duration in hours from a set of dates.
 *
 * @param shiftTimes
 */
export const getShiftHours = ({ start, end, breakDuration }: Shift) => {
  // Get the difference between start and end times, minus break duration.
  const shiftMinutes =
    (new Date(end).getTime() - new Date(start).getTime()) / 60000 -
    breakDuration;
  return shiftMinutes / 60;
};

/**
 * Calculates a shift duration in hours from a set of dates.
 *
 * @param shiftTimes
 */
export const getTimesheetTotalHours = ({ shifts }: Timesheet) => {
  return shifts
    ? shifts
        .reduce((totalHours, shift) => {
          return totalHours + getShiftHours(shift);
        }, 0)
        .toFixed(2)
    : "0.00";
};
