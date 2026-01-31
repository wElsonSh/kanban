const openDB = indexedDB.open("kanban", 1)
    , create_desk_btn = document.querySelector(".create_desk_btn")
    , navbar_desks_list = document.querySelector(".navbar_desks_list")
    , desk_monitor_list = document.querySelector(".desk_monitor_list")
let db
    , all_desks_btns
    , hash_s_count
    , routes = {}
openDB.onupgradeneeded = (event) => {
    db = event.target.result
    if (!db.objectStoreNames.contains("desks")) {
        db.createObjectStore("desks", {
            keyPath: "id",
            autoIncrement: true,
        })
    }

}
openDB.onerror = () => {
    alert("Ошибка, не удалось открыть БД: " + openDB.error);

}

openDB.onsuccess = (event) => {
    db = event.target.result
    showAllDataHTML()



    create_desk_btn.addEventListener("click", () => {
        createNewDesk(prompt("Введи название доски: "))
        navbar_desks_list.innerHTML = ""
        showAllDataHTML()
    })

    window.addEventListener('hashchange', () => {
        router()
    });
    window.addEventListener("load", () => {
        router()
    })
}

const createNewDesk = (DeskName) => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")

    store.add({
        name: DeskName, columns: [
            { column_name: "column_1", tasks: [] },
            { column_name: "column_2", tasks: [] }
        ]
    })
    let get_hash = localStorage.getItem("hash")



    if (!get_hash) {
        localStorage.setItem("hash", 0)
        // console.log(localStorage.getItem("hash"));
    }

    let old_hash = parseInt(localStorage.getItem("hash"))
        , new_hash = old_hash + 1
    localStorage.setItem("hash", new_hash)
    // console.log(localStorage.getItem("hash"));

}

const showAllDataHTML = () => {
    let transaction = db.transaction("desks", "readonly")
        , store = transaction.objectStore("desks")
        , readStore = store.getAll()
    readStore.onsuccess = () => {
        let readStoreRes = [...readStore.result]
        console.log(readStoreRes);


        readStoreRes.forEach(desk => {
            const newDesk = document.createElement("li")

            newDesk.className = "navbar_desks_list_item"
            newDesk.innerHTML = `
                <a href="#/${desk.id}">
                    <i class="fa-solid fa-folder"></i>
                    <p>${desk.name}</p>
                </a>
            `
            navbar_desks_list.appendChild(newDesk)

            all_desks_btns = document.querySelectorAll(".navbar_desks_list_item")
            hash_s_count = desk.id
            routesCreator(hash_s_count)

        });
        deskNavBtnsSTYLE()
    }
}

const deskNavBtnsSTYLE = () => {
    if (all_desks_btns) {
        all_desks_btns.forEach(btn => {
            let random_num = Math.floor(Math.random() * 6) + 1;
            if (random_num == 1) {
                btn.style.backgroundColor = "#F960D3"
            } else if (random_num == 2) {
                btn.style.backgroundColor = "#13D19F"
            } else if (random_num == 3) {
                btn.style.backgroundColor = "#F88203"
            } else if (random_num == 4) {
                btn.style.backgroundColor = "#19B0E9"
            } else if (random_num == 5) {
                btn.style.backgroundColor = "#2B4FFF"
            } else if (random_num == 6) {
                btn.style.backgroundColor = "#FF393B"
            }

        })
    }

}

const getWindowHash = () => {
    let hash = window.location.hash.slice(1)
    return hash
}

const routesCreator = (count) => {
    for (let i = 1; i <= count; i++) {
        routes[`/${i}`] = `desk ${i}`
    }
}

const router = () => {
    const path = getWindowHash()
        , s_path = path.slice(1)

    if (routes[path]) {
        let transaction = db.transaction("desks", "readonly")
            , store = transaction.objectStore("desks")
            , getAll = store.getAll()
        getAll.onsuccess = () => {
            let getAllRes = [...getAll.result]

            getAllRes.forEach(res => {
                if (res.id == s_path) {
                    let columns_arr = [...res.columns]

                    showColumnsHTML(columns_arr)
                }
            })
        }

    } else {
        desk_monitor_list.innerHTML = "404"
    }

}
const showColumnsHTML = (arr) => {
    desk_monitor_list.innerHTML = ""
    arr.forEach(col => {

        let column = document.createElement("li")
        column.className = "column"
        column.innerHTML = `
        <div class="column_characteristics">
            <div class="column_header">
                <span class='column_name' id='column_name'>${col.column_name}</span>
                <button class='delete_column_btn'><i class="fa-solid fa-trash"></i></button>
            </div>
            <ul class="column_tegs">
                <li class="column_teg">#teg</li>
                <li class="column_teg">#home</li>
                <li class="column_teg">#work</li>
                <li class="column_teg">#teg</li>
                <li class="column_teg">#home</li>
                <li class="column_teg">#work</li>
            </ul>
        </div>
        <div class="column_content">
            <ul class="column_content_list">
                <li class="column_task_creator">
                    <button class="task_creator_btn">
                        <p>Создать задачу</p>
                    </button>
                </li>
                <li class='column_content_task'>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae
                        reiciendis maxime quibusdam temporibus! Tempora quam doloribus eum
                        consequuntur labore tenetur dignissimos sapiente nobis quae corrupti?</p>
                </li>
                <li class='column_content_task'>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis,
                        ducimus!</p>
                </li>
            </ul>
        </div>
        `
        desk_monitor_list.appendChild(column)
    })
}
