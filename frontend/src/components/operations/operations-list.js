import { HttpUtils } from "../../utils/http-utils.js";
import { CommonUtils } from "../../utils/common-utils.js";

export class OperationsList {
    constructor() {
        this.createIncomeButton = document.getElementById('create-income');
        this.createExpenseButton = document.getElementById('create-expense');
        this.filterActions = document.querySelectorAll('.filter-action');
        this.todayBtn = document.getElementById('today');
        this.intervalBtn = document.getElementById('interval');
        this.intervalBlock = document.getElementById('interval-block');
        this.intervalFromInput = document.getElementById('interval-from');
        this.intervalToInput = document.getElementById('interval-to');

        this.createIncomeButton.addEventListener('click', (e) => {
            location.href = '#/operations/create?operation=income';
        });
        this.createExpenseButton.addEventListener('click', (e) => {
            location.href = '#/operations/create?operation=expense';
        });

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
            this.getOperations(CommonUtils.getDateInRange(range));
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

        this.showOperations(result.response);
    }

    showOperations(operations) {
        const listElement = document.getElementById('operations-list');
        listElement.innerHTML = '';

        if (operations.length < 1) {
            const trElement = document.createElement('tr');
            trElement.innerHTML = '<td colspan="7" class="table-message">Нет операций за выбранный период</td>';
            listElement.appendChild(trElement);
            return;
        }

        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerHTML = `<span class="table-number">${i + 1}</span>`;
            if (operations[i].type === 'income') {
                trElement.insertCell().innerHTML = '<span id="table-income">доход</span>';
            }
            if (operations[i].type === 'expense') {
                trElement.insertCell().innerHTML = '<span id="table-expense">расход</span>';
            }
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount + ' $';

            const dateParts = operations[i].date.split('-');

            trElement.insertCell().innerText = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML = `
                    <div class="d-flex">
                        <a type="button" class="table-button delete-btn me-3 text-decoration-none" id="${operations[i].id}" data-bs-toggle="modal"
                           data-bs-target="#operationsModal">
                           <img src="../../../src/static/images/delete-icon.svg" alt="delete">
                        </a>
                        <a href="/#/operations/edit?id=${operations[i].id}" class="table-button text-decoration-none">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                                      fill="black"/>
                            </svg>
                        </a>
                        `;

            listElement.appendChild(trElement);
        }

        document.querySelectorAll('.delete-btn').forEach(element => {
            element.addEventListener('click', (e) => {
                let id = '';
                if (e.target.tagName === 'A') {
                    id = e.target.getAttribute('id');
                } else {
                    id = e.target.parentElement.getAttribute('id');
                }

                document.getElementById('confirm-button').addEventListener('click', this.deleteOperation.bind(this, id));
            })
        })
    }

    async deleteOperation(id) {
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            alert(result.response.message);
        } else {
            alert('Операция удалена');
        }

        location.href = '#/operations';
    }
}
