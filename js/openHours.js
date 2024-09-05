
const openHours = {
    1: { order: 0, name: "Måndag", nameSingular: "måndag", from: "1000", to: "1600" },
    2: { order: 1, name: "Tisdag", nameSingular: "tisdag", from: "1000", to: "1600" },
    3: { order: 2, name: "Onsdag", nameSingular: "onsdag", from: "1000", to: "1600" },
    4: { order: 3, name: "Torsdag", nameSingular: "torsdag", from: "1000", to: "1600" },
    5: { order: 4, name: "Fredag", nameSingular: "fredag", from: "1000", to: "1600" },
    6: { order: 5, name: "Lördag", nameSingular: "lördag", from: "1200", to: "1500" },
    0: { order: 6, name: "Söndag", nameSingular: "söndag", from: false, to: false }
};

const closedDates = {
    0: {
        name: "januari",
        days: { 1: "Nyårsdagen", 6: "Trettondedag jul" },
    },
    4: {
        name: "maj",
        days: { 1: "Första maj" },
    },
    5: {
        name: "juni",
        days: { 6: "Nationaldagen" },
    },
    11: {
        name: "december",
        days: {
            24: "Julafton",
            25: "Juldagen",
            26: "Annandag jul",
            31: "Nyårsafton",
        },
    },
};
