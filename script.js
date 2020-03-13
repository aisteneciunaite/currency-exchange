// get exhange rate eur-us, post it in console
// /!\ need to purify the functions
const url = 'https://api.exchangeratesapi.io/latest?base='; //base - convert from; symbols: convert to; can list multiple
const baseCurrencySelector = document.getElementById('baseCurr');
const baseAmountInput = document.getElementById('baseAmount');
const resultContainer = document.getElementById('result');
baseCurrencySelector.addEventListener('change', getExchange);
baseAmountInput.addEventListener('input', populateExchanged);
let exRates = {}; // do I realy need to strore the exchange rates in global object? maybe
const baseCurrencies = [
    {name: 'EUR', symbol: '€'},
    {name: 'USD', symbol: '$'}
]

// get exchange rates from API

function getExchange() {
    let base = baseCurrencySelector.selectedOptions[0];
    baseAmountInput.placeholder = base.symbol + '00.00';
    let http = new XMLHttpRequest();

    http.onload = function() {
		if (http.status == 200) {
            data=JSON.parse(http.response);
            exRates = data.rates;
            populateExchanged();
        }
    }

    http.open("GET", url+base.value);

    http.send();
}

// calculate base amount for every available currency, create and insert DOM elements
function populateExchanged() {
    let base = baseCurrencySelector.selectedOptions[0].value;
    resultContainer.innerHTML = '';

    let excAmount;
    for (const currency in exRates) {
        if (exRates.hasOwnProperty(currency)) {
            let excRateNode = document.createElement('div');
            excRateNode.innerHTML = `1 ${base} = ${exRates[currency].toFixed(2)} ${currency}`;
            excRateNode.classList.add('text-muted', 'small');

            let excAmountNode = document.createElement('div');
            excAmount = (baseAmountInput.value * exRates[currency]).toFixed(2);
            excAmountNode.innerHTML = excAmount > 0 ? `${excAmount} ${currency}`: `--.-- ${currency}`;
            excAmountNode.classList.add('h4', 'font-weight-lighter');

            let resultCard = document.createElement('div');
            resultCard.classList.add('col', 'mb-4');
            
            resultContainer.appendChild(resultCard);
            resultCard.appendChild(excAmountNode);
            resultCard.appendChild(excRateNode);
            resultCard.innerHTML = `<div class="card"><div class="card-body">${resultCard.innerHTML}</div></div>`;
        }
    }
}

// populate html dropdown with available options

baseCurrencies.forEach(el => {
    let option = document.createElement('option');
    option.innerHTML = el.name;
    option.value = el.name;
    option.symbol = el.symbol;
    baseCurrencySelector.appendChild(option);
});

getExchange();