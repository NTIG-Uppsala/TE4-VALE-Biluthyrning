let dataValue, langValue;

(async () => {
    const dataResponse = await fetch("/GET/location");
    dataValue = await dataResponse.json();

    const langResponse = await fetch("/GET/language");
    langValue = await langResponse.json();
})();

console.log(dataValue, langValue);