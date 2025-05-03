import { HttpUtils } from "../../utils/http-utils.js";

export class OperationsEdit {
    constructor() {
        this.typeSelectElement = document.getElementById('type-select');
        this.categorySelectElement = document.getElementById('category-select');
        this.amountInputElement = document.getElementById('amount-input');
        this.dateInputElement = document.getElementById('date-input');
        this.commentInputElement = document.getElementById('comment-input');

        this.incomesCategories = [];
        this.expensesCategories = [];

        this.operationType = '';

        this.operationId = location.href.split('=')[1];
        if (!this.operationId) {
            location.href = '#/';
        }

        this.getCategories();

        document.getElementById('save-button').addEventListener('click', this.updateOperation.bind(this, this.operationId));
    }

    async getCategories() {
        const incomesResult = await HttpUtils.request('/categories/income');
        const expensesResult = await HttpUtils.request('/categories/expense');

        if ((incomesResult.error || !incomesResult.response) || (expensesResult.error || !expensesResult.response)) {
            alert('Ошибка при запросе категорий.');
            location.href = '#/';
        }

        if (incomesResult.response ) {
            this.incomesCategories = incomesResult.response;
        }
        if (expensesResult.response ) {
            this.expensesCategories = expensesResult.response;
        }

        await this.getOperation(this.operationId)
    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);

        if (result.error || !result.response) {
            alert('Ошибка при запросе списка доходов и расходов.');
            location.href = '#/';
        }

        this.operation = result.response;
        this.operationType = result.response.type;

        this.amountInputElement.value = result.response.amount;
        this.dateInputElement.value = result.response.date;
        this.commentInputElement.value = result.response.comment;

        this.operationType === 'income' ? this.typeSelectElement.selectedIndex = 0 : this.typeSelectElement.selectedIndex = 1;

        this.typeSelectElement.addEventListener('change', () => {
            if (this.typeSelectElement.selectedIndex === 0) {
                this.operationType = 'income';
            } else if (this.typeSelectElement.selectedIndex === 1) {
                this.operationType = 'expense';
            }

            this.showCategories(this.operationType);
        });

        this.showCategories(result.response.type);
    }

    showCategories(operation) {
        this.categorySelectElement.innerHTML = '';
        let categories;
        if (operation === 'income') {
            categories = this.incomesCategories;
        } else if (operation === 'expense') {
            categories = this.expensesCategories;
        }

        for (let i = 0; i < categories.length; i++) {
            const option = document.createElement('option');
            option.value = categories[i].id;
            option.innerText = categories[i].title;
            this.categorySelectElement.appendChild(option);

            if (categories[i].title === this.operation.category) {
                this.categorySelectElement.selectedIndex = i;
            }
        }
    }

    validateForm() {
        let isValid = true;

        if (!this.amountInputElement.value) {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        } else {
            this.amountInputElement.classList.remove('is-invalid');
        }

        if (!this.dateInputElement.value) {
            this.dateInputElement.classList.add('is-invalid');
            isValid = false;
        } else {
            this.dateInputElement.classList.remove('is-invalid');
        }

        if (!this.commentInputElement.value) {
            this.commentInputElement.classList.add('is-invalid');
            isValid = false;
        } else {
            this.commentInputElement.classList.remove('is-invalid');
        }

        return isValid;
    }

    async updateOperation(id) {
        if (this.validateForm()) {
            const updateData = {
                type: this.typeSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelectElement.value),
            }

            const result = await HttpUtils.request('/operations/' + id, 'PUT', true, updateData);

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                alert(result.response.message);
            } else {
                alert('Операция обновлена');
            }

            location.href = '#/operations';
        }
    }
}
