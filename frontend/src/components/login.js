export class Login {
    constructor() {
        this.emailElement = document.getElementById('email-input');
        this.passwordElement = document.getElementById('password-input');
        this.rememberMeElement = document.getElementById('remember-me');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.rememberMeElement.checked) {
            this.rememberMeElement.classList.remove('is-invalid');
        } else {
            this.rememberMeElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}
