
const openHours = {
    1: { name: "Måndagar", nameSingular: "måndag", from: "1000", to: "1600" },
    2: { name: "Tisdagar", nameSingular: "tisdag", from: "1000", to: "1600" },
    3: { name: "Onsdagar", nameSingular: "onsdag", from: "1000", to: "1600" },
    4: { name: "Torsdagar", nameSingular: "torsdag", from: "1000", to: "1600" },
    5: { name: "Fredagar", nameSingular: "fredag", from: "1000", to: "1600" },
    6: { name: "Lördagar", nameSingular: "lördag", from: "1200", to: "1500" },
    0: { name: "Söndagar", nameSingular: "söndag", from: false, to: false }
};

const closedDates = {
    0: { 1: "Nyårsdagen", 6: "Trettondagen" },
    4: { 1: "Första maj" },
    5: { 6: "Nationaldagen" },
    11: { 24: "Julafton", 25: "Juldagen", 26: "Annandag jul", 31: "Nyårsafton" }
}