import country from './country.js'; // Import the country object

document.addEventListener('DOMContentLoaded', async function() {
    const base_URL = "https://api.exchangerate-api.com/v4/latest/";

    // Get the elements from the DOM
    const amountInput = document.querySelector('.amount input');
    const fromDropdown = document.querySelector('[name="from"]');
    const toDropdown = document.querySelector('[name="to"]');
    const fromFlag = document.querySelector('.from img');
    const toFlag = document.querySelector('.to img');
    const msgDisplay = document.querySelector('.msg');
    const button = document.querySelector('button');

    // Populate the 'from' and 'to' dropdowns with country codes and flags
    Object.keys(country).forEach(currencyCode => {
        const countryCode = country[currencyCode];

        // Create 'from' dropdown options
        const optionFrom = document.createElement('option');
        optionFrom.value = currencyCode;
        optionFrom.textContent = `${countryCode} (${currencyCode})`; // Display country name and code
        fromDropdown.appendChild(optionFrom);

        // Create 'to' dropdown options
        const optionTo = document.createElement('option');
        optionTo.value = currencyCode;
        optionTo.textContent = `${countryCode} (${currencyCode})`; // Display country name and code
        toDropdown.appendChild(optionTo);
    });

    // Set default values (USD as 'From' and INR as 'To') and update flags
    const setDefaultCurrency = () => {
        const defaultFromCurrency = 'USD';
        const defaultToCurrency = 'INR';

        fromDropdown.value = defaultFromCurrency;
        toDropdown.value = defaultToCurrency;

        updateFlags(defaultFromCurrency, defaultToCurrency);
    };

    // Update the flag images when the 'From' or 'To' currency is changed
    const updateFlags = (fromCurrency, toCurrency) => {
        const fromCountryFlag = `https://flagsapi.com/${country[fromCurrency]}/flat/64.png`;
        const toCountryFlag = `https://flagsapi.com/${country[toCurrency]}/flat/64.png`;

        // Update flag images
        fromFlag.src = fromCountryFlag;
        toFlag.src = toCountryFlag;
    };

    // Initial flag update and default currency selection
    setDefaultCurrency();

    // Event listener for when the user changes the selected currency
    fromDropdown.addEventListener('change', () => updateFlags(fromDropdown.value, toDropdown.value));
    toDropdown.addEventListener('change', () => updateFlags(fromDropdown.value, toDropdown.value));

    // Event listener for the button click to fetch and display the conversion result
    button.addEventListener('click', async (evt) => {
        evt.preventDefault();

        // Get selected currencies and amount
        const fromCurrency = fromDropdown.value;
        const toCurrency = toDropdown.value;
        let amount = parseFloat(amountInput.value);

        // Validate the amount
        if (isNaN(amount) || amount <= 0) {
            amount = 1;
            amountInput.value = 1;
        }

        // Fetch the exchange rates
        try {
            const url = `${base_URL}${fromCurrency}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data || !data.rates || !data.rates[toCurrency]) {
                msgDisplay.textContent = 'Conversion rate not found';
                return;
            }

            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            msgDisplay.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } catch (error) {
            console.error("Error fetching data:", error);
            msgDisplay.textContent = 'Error fetching data';
        }
    });
});
