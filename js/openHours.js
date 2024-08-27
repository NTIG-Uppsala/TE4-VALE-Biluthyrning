
/**
 * Represents the open hours of the business.
 * @typedef {Object} OpenHours
 * @property {number} order - The order of the day in the week.
 * @property {string} name - The name of the day.
 * @property {string} nameSingular - The singular name of the day.
 * @property {string|boolean} from - The opening time of the day. Can be a string representing the time or false if closed.
 * @property {string|boolean} to - The closing time of the day. Can be a string representing the time or false if closed.
 */

/**
 * Object containing the open hours of the business.
 * @type {OpenHours}
 */
const openHours = {
    1: { order: 0, name: "Måndagar", nameSingular: "måndag", from: "1000", to: "1600" },
    2: { order: 1, name: "Tisdagar", nameSingular: "tisdag", from: "1000", to: "1600" },
    3: { order: 2, name: "Onsdagar", nameSingular: "onsdag", from: "1000", to: "1600" },
    4: { order: 3, name: "Torsdagar", nameSingular: "torsdag", from: "1000", to: "1600" },
    5: { order: 4, name: "Fredagar", nameSingular: "fredag", from: "1000", to: "1600" },
    6: { order: 5, name: "Lördagar", nameSingular: "lördag", from: "1200", to: "1500" },
    0: { order: 6, name: "Söndagar", nameSingular: "söndag", from: false, to: false }
};

/**
 * Object containing the closed dates of the business in the format { month: { day: "Name of the day" } }.
 * @type {Object}
 */

const closedDates = {
    0: { 1: "Nyårsdagen", 6: "Trettondagen" },
    4: { 1: "Första maj" },
    5: { 6: "Nationaldagen" },
    11: { 24: "Julafton", 25: "Juldagen", 26: "Annandag jul", 31: "Nyårsafton" }
}