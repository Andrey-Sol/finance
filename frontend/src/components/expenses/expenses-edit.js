import { HttpUtils } from "../../utils/http-utils.js";

export class ExpensesEdit {
    constructor() {
        this.currentValue = null;

        const id  = location.href.split('=')[1];
        if (!id) {
            location.href = '#/';
        }

        document.getElementById('save-button').addEventListener('click', this.updateExpense.bind(this, id))
        this.titleInputElement = document.getElementById('title-input');

        this.getExpense(id).then();
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);

        if (result.error || !result.response) {
            alert('Ошибка при запросе расходов.');
            location.href = '#/';
        }

        if (result.response ) {
            this.currentValue = result.response.title;
            this.titleInputElement.value = result.response.title;
        }
    }

    async updateExpense(id) {
        if (this.titleInputElement.value === this.currentValue) {
            location.href = '#/expenses';
            return;
        }

        if (!this.titleInputElement.value) {
            this.titleInputElement.classList.add('is-invalid');
            return;
        } else {
            this.titleInputElement.classList.remove('is-invalid');
        }

        const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, {
            title: this.titleInputElement.value
        });

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            alert(result.response.message);
        } else {
            alert('Категория обновлена');
        }

        location.href = '#/expenses';
    }
}
