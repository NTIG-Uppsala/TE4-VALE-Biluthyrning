
const openHours = {
    1: { order: 0, name: "Måndagar", nameSingular: "måndag", from: "1000", to: "1600" },
    2: { order: 1, name: "Tisdagar", nameSingular: "tisdag", from: "1000", to: "1600" },
    3: { order: 2, name: "Onsdagar", nameSingular: "onsdag", from: "1000", to: "1600" },
    4: { order: 3, name: "Torsdagar", nameSingular: "torsdag", from: "1000", to: "1600" },
    5: { order: 4, name: "Fredagar", nameSingular: "fredag", from: "1000", to: "1600" },
    6: { order: 5, name: "Lördagar", nameSingular: "lördag", from: "1200", to: "1500" },
    0: { order: 6, name: "Söndagar", nameSingular: "söndag", from: false, to: false }
};

const closedDates = {
    0: { 1: "Nyårsdagen", 6: "Trettondagen" },
    4: { 1: "Första maj" },
    5: { 6: "Nationaldagen" },
    11: { 24: "Julafton", 25: "Juldagen", 26: "Annandag jul", 31: "Nyårsafton" }
}