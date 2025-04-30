import { HttpUtils } from "../../utils/http-utils.js";

export class ExpensesList {
    constructor() {
        this.getExpenses();
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');

        if (result.error || !result.response) {
            alert('Ошибка при запросе расходов.');
            location.href = '#/';
        }

        this.showExpenses(result.response);
    }

    showExpenses(expenses) {
        const listElement = document.getElementById('expenses-list');
        const addElement = document.getElementById('add-button');

        for (let i = 0; i < expenses.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('category-item', 'border', 'border-2', 'rounded-4', 'p-sm-4', 'p-3', 'my-2', 'mx-sm-2', 'm-1', 'col-4');

            itemElement.innerHTML = `
            <div class="category-item-title mb-3">${expenses[i].title}</div>
            <div class="category-item-buttons">
                <a type="button" class="btn btn-primary me-2" href="/#/expenses/edit?id=${expenses[i].id}">Редактировать</a>
                <a type="button" class="btn btn-danger delete-button" id="${expenses[i].id}" data-bs-toggle="modal" data-bs-target="#expensesModal">Удалить</a>
            </div>
            `;

            listElement.insertBefore(itemElement, addElement);
        }

        document.querySelectorAll('.delete-button').forEach((element) => {
            element.addEventListener('click', (element) => {
                const id = element.target.getAttribute('id');
                document.getElementById('confirm-button').addEventListener('click', this.deleteExpense.bind(this, id));
            })
        })
    }

    async deleteExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            alert(result.response.message);
        } else {
            alert('Категория удалена');
        }

        location.href = '#/expenses';
    }
}
