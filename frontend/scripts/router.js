
// Импорт JS-файлов (компонентов) каждой страницы

export class Router {
    constructor() {
        this.contentElement = document.getElementById("content");
        this.titleElement = document.getElementById("page-title");

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
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

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}
