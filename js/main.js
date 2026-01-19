const routes = {
    '/': {
        template: '',
        script: () => console.log('Desks загружена')
    },
    '/search': {
        template: '<h1>Search</h1>',
        script: () => console.log('Search загружена')
    },
    '404': {
        template: '<h1>Страница не найдена</h1>',
        script: () => console.log('Hash не найден')
    }
};

class hashRouter {
    constructor(routes) {
        this.routes = routes;
        this.currentRout = null

        window.addEventListener("hashchange", () => this.handleRouting())
        window.addEventListener("load", () => this.handleRouting())
    }
    handleRouting() {
        const hash = window.location.hash.substring(1) || '/'
            , route = this.routes[hash] || this.routes['404']
        if (route && route.template) {
            document.getElementById('desk_container').innerHTML = route.template
            if (route.script) route.script()
        }
        this.currentRout = hash
    }
}

new hashRouter(routes)

document.getElementById("desk_columns_list_container").addEventListener("wheel", (event) => {
    if (!event.shiftKey) {
        alert("Зажми Shift для прокрутки")
    }
})