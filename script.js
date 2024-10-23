document.addEventListener('DOMContentLoaded', function () {
    let sipChart;
    let lumpsumChart;
    function updateChart(investedAmount, estimatedReturns) {
        const ctx = document.getElementById('sipChart').getContext('2d');
        const data = {
            labels: ['Invested amount', 'Est. returns'],
            datasets: [{
                data: [investedAmount, estimatedReturns],
                backgroundColor: ['#4caf50', '#2196f3'],
            }]
        };

        if (sipChart) {
            sipChart.destroy(); // Destroy the previous chart instance
        }

        sipChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return '₹' + tooltipItem.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Chart update for Lumpsum
    function updateLumpsumChart(investedAmount, estimatedReturns) {
        const ctx = document.getElementById('lumpsumChart').getContext('2d');
        const data = {
            labels: ['Invested amount', 'Est. returns'],
            datasets: [{
                data: [investedAmount, estimatedReturns],
                backgroundColor: ['#ff9800', '#3f51b5'],
            }]
        };

        if (lumpsumChart) {
            lumpsumChart.destroy(); // Destroy the previous chart instance
        }

        lumpsumChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return '₹' + tooltipItem.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    function updateResults() {
        const investment = parseInt(document.getElementById('monthlyInvestment').value);
        const rate = parseFloat(document.getElementById('returnRate').value) / 100;
        const years = parseInt(document.getElementById('timePeriod').value);
        const stepUpAmount = parseInt(document.getElementById('stepUpAmount').value);

        const months = years * 12;
        let investedAmount = 0;
        let futureValue = 0;
        let currentInvestment = investment;

        // Calculate SIP with step-up
        for (let i = 1; i <= years; i++) {
            for (let j = 0; j < 12; j++) {
                investedAmount += currentInvestment;
                futureValue += currentInvestment * ((1 + rate / 12) ** (months - ((i - 1) * 12 + j)));
            }
            currentInvestment += stepUpAmount; // Increase investment by step-up amount every year
        }

        const estimatedReturns = futureValue - investedAmount;

        document.getElementById('investedAmount').textContent = '₹' + formatToIndianNumber(investedAmount).toLocaleString();
        document.getElementById('estimatedReturns').textContent = '₹' + formatToIndianNumber(estimatedReturns).toLocaleString();
        document.getElementById('totalValue').textContent = '₹' + formatToIndianNumber(futureValue).toLocaleString();

        updateChart(investedAmount, estimatedReturns);
    }

    function updateLumpsumResults() {
        const lumpsumInvestment = parseInt(document.getElementById('lumpsumInvestment').value);
        const lumpsumRate = parseFloat(document.getElementById('lumpsumReturnRate').value) / 100;
        const lumpsumYears = parseInt(document.getElementById('lumpsumTimePeriod').value);
        const lumpsumFutureValue = lumpsumInvestment * Math.pow((1 + lumpsumRate), lumpsumYears);
        const lumpsumEstimatedReturns = lumpsumFutureValue - lumpsumInvestment;

        document.getElementById('lumpsumInvestedAmount').textContent = '₹' + formatToIndianNumber(lumpsumInvestment).toLocaleString();
        document.getElementById('lumpsumEstimatedReturns').textContent = '₹' + formatToIndianNumber(lumpsumEstimatedReturns).toLocaleString();
        document.getElementById('lumpsumTotalValue').textContent = '₹' + formatToIndianNumber(lumpsumFutureValue).toLocaleString();

        updateLumpsumChart(lumpsumInvestment, lumpsumEstimatedReturns);
    }

    // Event listeners for input changes
    document.getElementById('monthlyInvestment').addEventListener('input', function () {
        document.getElementById('monthlyInvestmentValue').textContent = '₹' + parseInt(this.value).toLocaleString();
        updateResults();
    });

    document.getElementById('returnRate').addEventListener('input', function () {
        document.getElementById('returnRateValue').textContent = parseFloat(this.value).toFixed(1) + '%';
        updateResults();
    });

    document.getElementById('timePeriod').addEventListener('input', function () {
        document.getElementById('timePeriodValue').textContent = this.value + ' Yr';
        updateResults();
    });

    document.getElementById('stepUpAmount').addEventListener('input', function () {
        document.getElementById('stepUpAmountValue').textContent = '₹' + parseInt(this.value).toLocaleString();
        updateResults();
    });



    // Add event listeners for Lumpsum input changes
    document.getElementById('lumpsumInvestment').addEventListener('input', function () {
        document.getElementById('lumpsumInvestmentValue').textContent = '₹' + parseInt(this.value).toLocaleString();
        updateLumpsumResults();
    });

    document.getElementById('lumpsumReturnRate').addEventListener('input', function () {
        document.getElementById('lumpsumReturnRateValue').textContent = parseFloat(this.value).toFixed(1) + '%';
        updateLumpsumResults();
    });

    document.getElementById('lumpsumTimePeriod').addEventListener('input', function () {
        document.getElementById('lumpsumTimePeriodValue').textContent = this.value + ' Yr';
        updateLumpsumResults();
    });


    // Initial calculation
    updateResults();


    // Initial calculation for Lumpsum
    updateLumpsumResults();
});

// Function for tab switching
function showTab(tabName) {
    // Hide all content
    document.getElementById('sip-content').classList.remove('active');
    document.getElementById('lumpsum-content').classList.remove('active');

    // Remove active class from all tabs
    document.getElementById('sip-tab').classList.remove('active');
    document.getElementById('lumpsum-tab').classList.remove('active');

    // Show the selected content
    document.getElementById(tabName + '-content').classList.add('active');

    // Add active class to the selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
}


function formatToIndianNumber(num) {
     // Ensure we are dealing with integers
    const integerPart = Math.floor(num).toString();

    // Add commas according to the Indian numbering system
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherDigits.length ? ',' : '') + lastThreeDigits;

    return formattedNumber;
}