import { Diagrams } from "./components/diagrams.js";
import { Logout } from "./components/auth/logout.js";
import { Form } from "./components/auth/form.js";
import { AuthUtils } from "./utils/auth-utils.js";

export class Router {
    constructor() {
        this.pageContentElement = document.getElementById("page-content");
        this.titleElement = document.getElementById("page-title");

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: '../src/templates/pages/diagrams.html',
                useLayout: '../src/templates/layout.html',
                load: () => {
                    new Diagrams();
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: '../src/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: '../src/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: '../src/templates/pages/incomes/income.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-income',
                title: 'Создание категории доходов',
                template: '../src/templates/pages/incomes/create-income-category.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-income',
                title: 'Редактирование категории доходов',
                template: '../src/templates/pages/incomes/edit-income-category.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: '../src/templates/pages/expenses/expenses.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-expenses',
                title: 'Создание категории расходов',
                template: '../src/templates/pages/expenses/create-expenses-category.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-expenses',
                title: 'Редактирование категории расходов',
                template: '../src/templates/pages/expenses/edit-expenses-category.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: '../src/templates/pages/operations/operations.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-operation',
                title: 'Создание дохода/расхода',
                template: '../src/templates/pages/operations/create-operation.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-operation',
                title: 'Редактирование дохода/расхода',
                template: '../src/templates/pages/operations/edit-operation.html',
                useLayout: '../src/templates/layout.html',
                load: () => {}
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            new Logout();
            return;
        }

        const newRoute = this.routes.find(item => item.route === urlRoute);
        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);

        if (!newRoute) {
            window.location.href = '#/';
            return
        }

        if (!userInfo && !accessToken) {
            if (urlRoute !== '#/login' && urlRoute !== '#/signup') {
                window.location.href = '#/login';
                return
            }
        } else {
            if (urlRoute === '#/login' || urlRoute === '#/signup') {
                window.location.href = '#/';
                return
            }
        }

        if (newRoute.useLayout) {
            this.pageContentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
            document.getElementById("layout-content").innerHTML = await fetch(newRoute.template).then(response => response.text());
            document.getElementById('profile-full-name').innerText = userInfo.name + ' ' + userInfo.lastName;

            // Переключение пунктов меню
            if (urlRoute === '#/') {
                document.getElementById('main-link').classList.add('active');
            }
            if (urlRoute === '#/operations') {
                document.getElementById('operations-link').classList.add('active');
            }

            // Переключение сайдбара
            document.getElementById('menu-toggle').addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('wrapper').classList.toggle('toggled');
            })

        } else {
            this.pageContentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        }

        this.titleElement.innerText = newRoute.title;

        if (newRoute.load && typeof newRoute.load === 'function') {
            newRoute.load();
        }
    }
}
