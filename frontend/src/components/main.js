import { CommonUtils } from "../utils/common-utils.js";
import { HttpUtils } from "../utils/http-utils.js";

export class Main {
    constructor() {
        this.filterActions = document.querySelectorAll('.filter-action');
        this.todayBtn = document.getElementById('today');
        this.intervalBtn = document.getElementById('interval');
        this.intervalBlock = document.getElementById('interval-block');
        this.intervalFromInput = document.getElementById('interval-from');
        this.intervalToInput = document.getElementById('interval-to');
        this.incomesChartElement = document.getElementById('incomes-chart-wrapper');
        this.incomesChartMessage = document.getElementById('incomes-chart-message');
        this.expensesChartElement = document.getElementById('expenses-chart-wrapper');
        this.expensesChartMessage = document.getElementById('expenses-chart-message');

        this.today = CommonUtils.getDateInRange('today');

        this.filterActions.forEach(btn => btn.addEventListener('click', (e) => {
            this.filterActions.forEach(item => {
                item.classList.remove('btn-secondary');
                item.classList.add('btn-outline-secondary');
            });
            e.target.classList.remove('btn-outline-secondary');
            e.target.classList.add('btn-secondary');
            this.intervalBtn.classList.remove('btn-secondary');
            this.intervalBtn.classList.add('btn-outline-secondary');
            this.intervalBlock.classList.remove('d-block');
            this.intervalBlock.classList.add('d-none');
            const range = e.target.getAttribute('id');
            this.getOperations(CommonUtils.getDateInRange(range)).then();
        }))

        this.intervalBtn.addEventListener('click', (e) => {
            this.filterActions.forEach(item => {
                item.classList.remove('btn-secondary');
                item.classList.add('btn-outline-secondary');
            });
            this.intervalBtn.classList.remove('btn-outline-secondary');
            this.intervalBtn.classList.add('btn-secondary');
            this.intervalBlock.classList.remove('d-none');
            this.intervalBlock.classList.add('d-block');
        })

        this.intervalFromInput.value = this.today;
        this.intervalToInput.value = this.today;

        this.intervalFromInput.addEventListener('input', (e) => {
            this.getOperations(this.intervalFromInput.value, this.intervalToInput.value)
        })
        this.intervalToInput.addEventListener('input', (e) => {
            this.getOperations(this.intervalFromInput.value, this.intervalToInput.value)
        })

        this.todayBtn.classList.remove('btn-outline-secondary');
        this.todayBtn.classList.add('btn-secondary');

        this.getOperations(this.today);
    }

    async getOperations(dateFrom, dateTo = this.today) {
        const result = await HttpUtils.request('/operations/?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo);

        if (result.error || !result.response) {
            alert('Ошибка при запросе списка доходов и расходов.');
            location.href = '#/';
        }

        this.showDiagrams(result.response);
    }

    showDiagrams(operations) {
        // Плагин для отступов
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

        // Диаграмма Доходов
        const incomesChart = document.getElementById('incomesChart');
        const incomeData = {
            labels: [],
            datasets: [
                {
                    label: 'Incomes',
                    data: [],
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
                    colors: {
                        forceOverride: true
                    }
                },
            },
            plugins: [paddingPlugin],
        }

        // Диаграмма Расходов
        const expensesChart = document.getElementById('expensesChart');
        const expensesData = {
            labels: [],
            datasets: [
                {
                    label: 'Expenses',
                    data: [],
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
                    colors: {
                        forceOverride: true
                    }
                },
            },
            plugins: [paddingPlugin],
        }

        const incomes = operations.filter(operation => operation.type === 'income');
        const expenses = operations.filter(operation => operation.type === 'expense');

        if (incomes.length > 0) {
            this.incomesChartElement.classList.remove('d-none');
            this.incomesChartElement.classList.add('d-block');
            this.incomesChartMessage.classList.remove('d-block');
            this.incomesChartMessage.classList.add('d-none');
        } else {
            this.incomesChartElement.classList.remove('d-block');
            this.incomesChartElement.classList.add('d-none');
            this.incomesChartMessage.classList.remove('d-none');
            this.incomesChartMessage.classList.add('d-block');
        }

        if (expenses.length > 0) {
            this.expensesChartElement.classList.remove('d-none');
            this.expensesChartElement.classList.add('d-block');
            this.expensesChartMessage.classList.remove('d-block');
            this.expensesChartMessage.classList.add('d-none');
        } else {
            this.expensesChartElement.classList.remove('d-block');
            this.expensesChartElement.classList.add('d-none');
            this.expensesChartMessage.classList.remove('d-none');
            this.expensesChartMessage.classList.add('d-block');
        }

        incomes.forEach(income => {
            incomeData.labels.push(income.comment);
            incomeData.datasets[0].data.push(income.amount);
        })

        expenses.forEach(income => {
            expensesData.labels.push(income.comment);
            expensesData.datasets[0].data.push(income.amount);
        })

        if (this.incomesChart) {
            this.incomesChart.destroy();
        }
        this.incomesChart = new Chart(incomesChart, incomeChartConfig);

        if (this.expensesChart) {
            this.expensesChart.destroy();
        }
        this.expensesChart = new Chart(expensesChart, expensesChartConfig);
    }
}
