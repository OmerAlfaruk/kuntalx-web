/**
 * Ethiopian Date Utilities
 * 
 * Provides conversion between Gregorian and Ethiopian (Abyssinian) calendars.
 * The Ethiopian calendar has 13 months: 12 months of 30 days each and a 
 * 13th month (Pagume) of 5 days (6 in leap years).
 */

export interface EthiopianDate {
    year: number;
    month: number;
    day: number;
}

const ETHIOPIAN_MONTHS = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
    'Magabit', 'Miyazya', 'Gunbot', 'Sane', 'Hamle', 'Nehasa', 'Pagume'
];

/**
 * Converts a Gregorian Date to Ethiopian Date.
 * Uses the Julian Day Number as an intermediate step for accuracy.
 */
export const toEthiopianDate = (date: Date): EthiopianDate => {
    const jdn = getJDN(date);

    // Ethiopian Era 1 (Amete Mihret) starts at JDN 1724221
    const n = jdn - 1724221;
    const year = Math.floor(n / 1461) * 4 + Math.floor(Math.min(Math.floor(n % 1461), 1460) / 365) + 1;
    const dayOfYear = (n % 1461) % 365 + (Math.floor(n % 1461) === 1460 ? 365 : 0);

    const month = Math.floor(dayOfYear / 30) + 1;
    const day = (dayOfYear % 30) + 1;

    return { year, month, day };
};

/**
 * Formats an Ethiopian date as a string.
 */
export const formatEthiopianDate = (date: Date, includeYear = true): string => {
    const eth = toEthiopianDate(date);
    const monthName = ETHIOPIAN_MONTHS[eth.month - 1];
    return `${monthName} ${eth.day}${includeYear ? `, ${eth.year}` : ''}`;
};

/**
 * Calculates the Julian Day Number for a Gregorian date.
 */
const getJDN = (date: Date): number => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    if (month <= 2) {
        year--;
        month += 12;
    }

    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);

    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
};

/**
 * Checks if a given Ethiopian year is a leap year.
 */
export const isEthiopianLeapYear = (year: number): boolean => {
    return (year + 1) % 4 === 0;
};
