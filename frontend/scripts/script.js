
// Переключение сайдбара

document.getElementById('menu-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('wrapper').classList.toggle('toggled');
})

/////

const paddingPlugin = {
    afterInit(chart) {
        chart.legend._update = chart.legend.update;
        chart.legend.update = function (...args) {
            this._update(...args);
            const padding = { ...(this.options.padding || {}) };
            this.height += Math.max(0, ~~padding.bottom);
            this.width += Math.max(0, ~~padding.right);
        };
    },
}

// Диаграмма 1

const incomeChart = document.getElementById('incomeChart');
const incomeData = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [12, 9, 3, 5, 2],
            backgroundColor: [
                'rgba(220, 53, 69, 1)',
                'rgba(253, 126, 20, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(32, 201, 151, 1)',
                'rgba(13, 110, 253, 1)',
            ]
        }
    ]
};

const incomeChartConfig = {
    type: 'pie',
    data: incomeData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                },
                padding: { bottom: 30 },
            },
            title: {
                display: true,
                text: 'Доходы',
                color: 'rgba(41, 6, 97, 1)',
                font: {
                    size: 28,
                    weight: 'bold',
                },
            },
        },
    },
    plugins: [paddingPlugin],
}

new Chart(incomeChart, incomeChartConfig);

// Диаграмма 2

const expensesChart = document.getElementById('expensesChart');
const expensesData = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [2, 5, 9, 11, 6],
            backgroundColor: [
                'rgba(220, 53, 69, 1)',
                'rgba(253, 126, 20, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(32, 201, 151, 1)',
                'rgba(13, 110, 253, 1)',
            ]
        }
    ]
};

const expensesChartConfig = {
    type: 'pie',
    data: expensesData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                },
                padding: { bottom: 30 },
            },
            title: {
                display: true,
                text: 'Расходы',
                color: 'rgba(41, 6, 97, 1)',
                font: {
                    size: 28,
                    weight: 'bold',
                },
            },
        },
    },
    plugins: [paddingPlugin],
}

new Chart(expensesChart, expensesChartConfig);

