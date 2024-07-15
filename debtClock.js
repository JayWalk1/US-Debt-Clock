async function fetchDebtData() {
    const response = await fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny');
    const data = await response.json();
    return data.data[0];
}

function formatNumber(number) {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    });
}

async function displayDebtClock() {
    const debtData = await fetchDebtData();
    const totalDebt = parseFloat(debtData.total_public_debt_outstanding);
    document.getElementById('debtClock').innerHTML = formatNumber(totalDebt);
}

document.addEventListener('DOMContentLoaded', function() {
    displayDebtClock();
    setInterval(displayDebtClock, 60000); // Update every 60 seconds
});
