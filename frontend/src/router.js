import { Diagrams } from "./components/diagrams.js";

export class Router {
    constructor() {
        this.pageContentElement = document.getElementById("page-content");
        this.titleElement = document.getElementById("page-title");

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/diagrams.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new Diagrams();
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                useLayout: false,
                load: () => {}
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/sign-up.html',
                useLayout: false,
                load: () => {}
            },
            {
                route: '#/logout',
                load: () => {}
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-income',
                title: 'Создание категории доходов',
                template: 'templates/create-income-category.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-income',
                title: 'Редактирование категории доходов',
                template: 'templates/edit-income-category.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-expenses',
                title: 'Создание категории расходов',
                template: 'templates/create-expenses-category.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-expenses',
                title: 'Редактирование категории расходов',
                template: 'templates/edit-income-category.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/create-operation',
                title: 'Создание дохода/расхода',
                template: 'templates/create-operation.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
            {
                route: '#/edit-operation',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit-operation.html',
                useLayout: 'templates/layout.html',
                load: () => {}
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            // здесь вызвать метод логаут
            window.location.href = '#/';
            return
        }

        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (!newRoute) {
            window.location.href = '#/';
            return
        }
        if (newRoute.useLayout) {
            this.pageContentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
            document.getElementById("layout-content").innerHTML = await fetch(newRoute.template).then(response => response.text());

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
