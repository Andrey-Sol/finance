import { HttpUtils } from "../../utils/http-utils.js";

export class ExpensesCreate {
    constructor() {
        document.getElementById('create-button').addEventListener('click', this.createExpense.bind(this))
        this.titleInputElement = document.getElementById('title-input');
    }

    async createExpense(e) {
        e.preventDefault();
        if (!this.titleInputElement.value) {
            this.titleInputElement.classList.add('is-invalid');
            return;
        } else {
            this.titleInputElement.classList.remove('is-invalid');
        }

        const result = await HttpUtils.request('/categories/expense', 'POST', true, {
            title: this.titleInputElement.value
        });

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            alert(result.response.message);
        } else {
            alert('Категория создана');
        }

        location.href = '#/expenses';
    }
}
