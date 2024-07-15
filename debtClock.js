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
    console.log("Formatting number:", number);
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
}

async function initializeDebtClock() {
    try {
        const debtData = await fetchDebtData();
        console.log("Debt data:", debtData);
        const totalDebtString = debtData.tot_pub_debt_out_amt;
        console.log("Total debt string:", totalDebtString);
        
        // Remove any potential commas and convert to a float
        totalDebt = parseFloat(totalDebtString.replace(/,/g, ''));
        console.log("Parsed total debt:", totalDebt);

        if (isNaN(totalDebt)) {
            throw new Error(`Parsed total debt is NaN for string: ${totalDebtString}`);
        }

        // Example growth rate: Assume the debt increases by $1,000 per second
        growthRatePerSecond = 1000; // Adjust this value as needed

        // Start updating the debt clock
        setInterval(updateDebtClock, 1000 / 60); // Update every 1/60th of a second for smooth animation
    } catch (error) {
        console.error("Error initializing debt clock:", error);
        document.getElementById('debtClock').innerHTML = "Error loading debt data";
    }
}

function updateDebtClock() {
    // Calculate the new total debt
    totalDebt += growthRatePerSecond / 60; // Increment by the growth rate per frame

    // Update the displayed debt
    document.getElementById('debtClock').innerHTML = formatNumber(totalDebt);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDebtClock();
});
