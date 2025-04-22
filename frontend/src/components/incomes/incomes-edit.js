import { HttpUtils } from "../../utils/http-utils.js";

export class IncomesEdit {
    constructor() {
        this.currentValue = null;

        const id  = location.href.split('=')[1];
        if (!id) {
            location.href = '#/';
        }

        document.getElementById('save-button').addEventListener('click', this.updateIncome.bind(this, id))
        this.titleInputElement = document.getElementById('title-input');

        this.getIncome(id).then();
    }

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/' + id);

        if (result.error || !result.response) {
            alert('Ошибка при запросе доходов.');
            location.href = '#/';
        }

        if (result.response ) {
            this.currentValue = result.response.title;
            this.titleInputElement.value = result.response.title;
        }
    }

    async updateIncome(id) {
        if (this.titleInputElement.value === this.currentValue) {
            location.href = '#/incomes';
            return;
        }

        if (!this.titleInputElement.value) {
            this.titleInputElement.classList.add('is-invalid');
            return;
        } else {
            this.titleInputElement.classList.remove('is-invalid');
        }

        const result = await HttpUtils.request('/categories/income/' + id, 'PUT', true, {
            title: this.titleInputElement.value
        });

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            alert(result.response.message);
        } else {
            alert('Категория обновлена');
        }

        location.href = '#/incomes';
    }
}
