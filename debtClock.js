async function fetchDebtData() {
    console.log("Fetching data...");
    const response = await fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny');
    const data = await response.json();
    console.log("Data fetched:", data);
    // Find the most recent record
    const mostRecentRecord = data.data.reduce((latest, record) => {
        return new Date(record.record_date) > new Date(latest.record_date) ? record : latest;
    }, data.data[0]);
    return mostRecentRecord;
}

function formatNumber(number) {
    console.log("Formatting number:", number);
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
}

async function displayDebtClock() {
    try {
        const debtData = await fetchDebtData();
        console.log("Debt data:", debtData);
        const totalDebtString = debtData.tot_pub_debt_out_amt;
        console.log("Total debt string:", totalDebtString);
        
        // Remove any potential commas and convert to a float
        const totalDebt = parseFloat(totalDebtString.replace(/,/g, ''));
        console.log("Parsed total debt:", totalDebt);

        if (isNaN(totalDebt)) {
            throw new Error(`Parsed total debt is NaN for string: ${totalDebtString}`);
        }

        document.getElementById('debtClock').innerHTML = formatNumber(totalDebt);
    } catch (error) {
        console.error("Error displaying debt clock:", error);
        document.getElementById('debtClock').innerHTML = "Error loading debt data";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayDebtClock();
    setInterval(displayDebtClock, 60000); // Update every 60 seconds
});
