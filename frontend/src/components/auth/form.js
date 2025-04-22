import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class Form {
    constructor(page) {
        this.processElement = null;
        this.page = page;
        this.password = null;
        this.passwordElement = document.getElementById('password-input');

        const accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email-input',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password-input',
                element: null,
                regex: /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'name',
                id: 'name-input',
                element: null,
                regex: /^[А-Я][а-я]{2,}\s+[А-Я][а-я]{2,}\s+[А-Я][а-я]{2,}\s*/,
                valid: false,
            });
            this.fields.push({
                name: 'repeatPassword',
                id: 'repeat-password-input',
                element: null,
                regex: /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/,
                valid: false,
            });

            this.passwordElement.addEventListener('change', this.changePassword.bind(this))
        }

        const that = this;
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
        this.processElement = document.getElementById('process-button');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    changePassword() {
        this.password = this.passwordElement.value;
    }

    validateField(field, element) {
        if (field.name === 'repeatPassword') {
            if (!element.value || element.value !== this.password) {
                element.classList.remove('is-valid');
                element.classList.add('is-invalid');
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                field.valid = true;
            }
        } else {
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.remove('is-valid');
                element.classList.add('is-invalid');
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);

        if (validForm) {
            this.processElement.classList.remove('disabled');
        } else {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            const rememberMe = document.getElementById('remember-me').checked;

            if (this.page === 'signup') {
                try {
                    const result = await HttpUtils.request('/signup', 'POST', false, {
                        name: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: password,
                    })
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await HttpUtils.request('/login', 'POST', false, {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })
                if (result) {
                    if (result.error || !result.response.tokens.accessToken || !result.response.tokens.refreshToken
                        || !result.response.user.name || !result.response.user.lastName || !result.response.user.id) {
                        throw new Error(result.message);
                    }

                    AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                        id: result.response.user.id,
                        name: result.response.user.name,
                        lastName: result.response.user.lastName,
                    });
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
