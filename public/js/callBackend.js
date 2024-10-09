// Gets location and language data from the server
const fetchData = async () => {
    const dataResponse = await fetch("/GET/location");
    locationData = await dataResponse.json();
    const langResponse = await fetch("/GET/language");
    languageData = await langResponse.json();
    return { locationData, languageData };
}
