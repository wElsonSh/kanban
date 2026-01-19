const routes = {
    '/desks': {
        template: ``,
        script: () => console.log('Desks загружена')
    },
    '/search': {
        template: '<h1>Search</h1>',
        script: () => console.log('Search загружена')
    },
    '/': {
        template: '<h1>Добро пожаловать!</h1>',
        script: () => console.log('Search загружена')
    },
    '404': {
        template: '<h1>Страница не найдена</h1>',
        script: () => console.log('Hash не найден')
    }
};
const hash_link_list = document.querySelectorAll(".hash_link")

hash_link_list.forEach(link => {
    link.addEventListener("click", () => {
        link.classList.add("tools_list_item__active");
    })
})
window.addEventListener("hashchange", () => {
    hash_link_list.forEach(link => {
        if (link.hash == window.location.hash) {
            link.classList.add("tools_list_item__active");
        } else if (link.classList.contains("tools_list_item__active")) {
            link.classList.remove("tools_list_item__active");
        }
    })
})
window.addEventListener("load", () => {
    hash_link_list.forEach(link => {
        if (link.hash == window.location.hash) {
            link.classList.add("tools_list_item__active");
        } else if (link.classList.contains("tools_list_item__active")) {
            link.classList.remove("tools_list_item__active");
        }
    })
})

class hashRouter {
    constructor(routes) {
        this.routes = routes;
        this.currentRout = null

        window.addEventListener("hashchange", () => this.handleRouting())
        window.addEventListener("load", () => this.handleRouting())
    }
    handleRouting() {
        let hash = window.location.hash.substring(1) || '/'
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

