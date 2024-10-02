const fetchExchangeRates = async (currency) => {
    const apiKey = '7ee8d776c33362f73cbf585e';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`; // Base currency is SEK
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.conversion_rates; // This returns the conversion rates object
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return null;
    }
}

const getCachedExchangeRates = async () => {
    const cacheKey = 'exchangeRates';
    const cacheTimeKey = 'exchangeRatesTime';
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (1 day)

    const cachedRates = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    // Check if rates are cached and are less than 24 hours old
    if (cachedRates && cachedTime && now - cachedTime < cacheDuration) {
        return JSON.parse(cachedRates); // Return cached exchange rates
    } else {
        // Fetch new rates and cache them
        const newRates = await fetchExchangeRates();
        if (newRates) {
            localStorage.setItem(cacheKey, JSON.stringify(newRates));
            localStorage.setItem(cacheTimeKey, now);
            return newRates;
        } else {
            return null; // Handle error case
        }
    }
}

const convertCurrency = async (priceInSek, targetCurrency) => {
    const exchangeRates = await getCachedExchangeRates();
    if (exchangeRates && exchangeRates[targetCurrency]) {
        return (priceInSek * exchangeRates[targetCurrency]).toFixed(2);
    }
    return priceInSek; // Fallback if rates are not available
}

// Update prices for all cars dynamically based on selected currency
const updateCarPrices = async (targetCurrency) => {
    const carPriceElements = document.querySelectorAll('.price');
    const exchangeRates = await getCachedExchangeRates();

    carPriceElements.forEach(async (element) => {
        const priceInSek = parseFloat(element.getAttribute('data-price-sek'));
        const convertedPrice = await convertCurrency(priceInSek, targetCurrency);
        element.textContent = `${convertedPrice} ${targetCurrency}`;
    });
}

