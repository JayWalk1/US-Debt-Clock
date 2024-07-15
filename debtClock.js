let totalDebt;
let growthRatePerSecond;

async function fetchDebtData() {
    console.log("Fetching data...");
    const response = await fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=1');
    const data = await response.json();
    console.log("Data fetched:", data);
    const mostRecentRecord = data.data[0];
    return mostRecentRecord;
}

function formatNumber(number) {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
}

function formatPlainNumber(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 0,
    });
}

function updateAnalogies(debt) {
    const moonDistance = 238855; // miles to the moon
    const billThickness = 0.0043; // inches
    const inchesToMiles = 63360; // inches in a mile
    const debtInInches = debt / billThickness;
    const debtInMiles = debtInInches / inchesToMiles;
    const roundTripMiles = moonDistance * 2;
    const billsForMoonTrip = roundTripMiles * inchesToMiles / billThickness;
    const moonTrips = formatPlainNumber((debt / billsForMoonTrip).toFixed(2));

    document.getElementById('stackedBills').innerText = `If you stacked $1 bills, the pile would reach to the moon and back ${moonTrips} times.`;

    const secondsInYear = 31536000; // Corrected to remove commas
    const yearsToSpend = formatPlainNumber((debt / (100 * secondsInYear)).toFixed(2));

    document.getElementById('timeComparison').innerText = `If you spent $100 every second, it would take you ${yearsToSpend} years to spend ${formatNumber(debt)}.`;

    const billWeight = 1 / 453.592; // weight in pounds
    const debtWeight = debt * billWeight / 100;
    const cruiseShipWeight = 70000 * 2000; // average cruise ship weight in pounds
    const cruiseShips = formatPlainNumber((debtWeight / cruiseShipWeight).toFixed(2));

    document.getElementById('weightComparison').innerText = `The weight of ${formatNumber(debt)} in $100 bills is equivalent to the weight of ${cruiseShips} cruise ships.`;

    const billLength = 6.14; // inches
    const footballFieldLength = 360 * 12; // inches
    const footballFields = formatPlainNumber((debtInInches / footballFieldLength).toFixed(2));

    document.getElementById('footballFields').innerText = `If you laid out $1 bills end to end, they would cover about ${footballFields} football fields.`;
}

async function initializeDebtClock() {
    try {
        const debtData = await fetchDebtData();
        const totalDebtString = debtData.tot_pub_debt_out_amt;
        
        totalDebt = parseFloat(totalDebtString.replace(/,/g, ''));
        if (isNaN(totalDebt)) {
            throw new Error(`Parsed total debt is NaN for string: ${totalDebtString}`);
        }

        growthRatePerSecond = 1000; // Example growth rate, adjust as needed
        setInterval(updateDebtClock, 10000 / 60); // Update every 1/60th of a second for smooth animation
    } catch (error) {
        console.error("Error initializing debt clock:", error);
        document.getElementById('debtClock').innerHTML = "Error loading debt data";
    }
}

function updateDebtClock() {
    totalDebt += growthRatePerSecond / 60;
    document.getElementById('debtClock').innerHTML = formatNumber(totalDebt);
    updateAnalogies(totalDebt);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDebtClock();
});
