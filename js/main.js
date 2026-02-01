const openDB = indexedDB.open("kanban", 1)
    , create_desk_btn = document.querySelector(".create_desk_btn")
    , navbar_desks_list = document.querySelector(".navbar_desks_list")
    , desk_monitor_list = document.querySelector(".desk_monitor_list")
    , creat_column_btn = document.querySelector(".creat_column_btn")
    , del_desk_btn = document.querySelector(".del_desk_btn")
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
        createNewDesk(prompt("Введи название доски: ") || "New desk")
        navbar_desks_list.innerHTML = ""
        showAllDataHTML()
    })

    window.addEventListener('hashchange', () => {
        router()
    });
    window.addEventListener("load", () => {
        history.replaceState(null, null, window.location.pathname + window.location.search)
    })

    creat_column_btn.addEventListener("click", () => {
        createColumn()
    })

    desk_monitor_list.addEventListener("click", (e) => {
        const taskCreator = e.target.closest(".task_creator_btn")
            , columnDelete = e.target.closest(".delete_column_btn")

        if (taskCreator) {
            createTask(taskCreator.id)
        } else if (columnDelete) {
            deleteColumn(columnDelete.id)
        }
    })
    del_desk_btn.addEventListener("click", () => {
        deleteDesk()
        history.replaceState(null, null, window.location.pathname + window.location.search)
    })

}

const createNewDesk = (DeskName) => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")

    store.add({
        name: DeskName, columns: [
            // { column_name: "column_1", tasks: [] },
            // { column_name: "column_2", tasks: [] }
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

        navbar_desks_list.innerHTML = ""
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
    console.log(arr);

    arr.forEach(col => {

        let column = document.createElement("li")
        column.className = "column"
        column.innerHTML = `
        <div class="column_characteristics">
            <div class="column_header">
                <span class='column_name'>${col.column_name}</span>
                <button class='delete_column_btn' id="${col.column_name}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <ul class="column_tegs" id="tegs__${col.column_name}">
            </ul>
        </div>
        <div class="column_content">
            <ul class="column_content_list" id="tasks__${col.column_name}">
                <li class="column_task_creator">
                    <button class="task_creator_btn" id="${col.column_name}">
                        <p>Создать задачу</p>
                    </button>
                </li>
            </ul>
        </div>
        `
        // <li class='column_content_task'>
        //             <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae
        //                 reiciendis maxime quibusdam temporibus! Tempora quam doloribus eum
        //                 consequuntur labore tenetur dignissimos sapiente nobis quae corrupti?</p>
        //         </li>
        desk_monitor_list.appendChild(column)


        let tegsArr = [...col.tegs]


        tegsArr.forEach(teg => {


            const column_tegs = document.getElementById(`tegs__${col.column_name}`)
                , tegHTML = document.createElement("li")
            tegHTML.className = "column_teg"
            tegHTML.innerHTML = `#${teg}`
            column_tegs.appendChild(tegHTML)
        })



        let tasksArr = [...col.tasks]
        console.log(tasksArr);

        tasksArr.forEach(task => {


            const column_tasks = document.getElementById(`tasks__${col.column_name}`)
                , taskHTML = document.createElement("li")

            taskHTML.className = "column_content_task"
            taskHTML.innerHTML = `<p>${task}</p>`
            column_tasks.appendChild(taskHTML)

            console.log(column_tasks);
        })
    })
}

const createColumn = () => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
        , id = Number(getWindowHash().slice(1))
        , getDesk = store.get(id)
    getDesk.onsuccess = () => {
        const data = getDesk.result
            , columnsArr = data.columns

        // if (!columnsArr) {
        //     console.log('nop');

        // }
        columnsArr.push({ column_name: prompt("Введи название колонки: ") || 'new column', tasks: [], tegs: prompt("Введите теги через пробел(без #): ").split(" ") || [] })
        console.log(columnsArr);

        store.put(data)
        router()
    }

}

const createTask = (columnName) => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
        , id = Number(getWindowHash().slice(1))
        , getDesk = store.get(id)
    getDesk.onsuccess = () => {
        const data = getDesk.result
            , columnsArr = data.columns
            , column = columnsArr.find(item => item.column_name == columnName)
        column.tasks.push(prompt("Введи задачу:") || 'Пусто нахуй')
        console.log(column.tasks);

        store.put(data)
        router()
    }


}

const deleteDesk = () => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
        , hash = Number(getWindowHash().slice(1))
        , deleteDesk = store.delete(hash)

    deleteDesk.onsuccess = () => {
        showAllDataHTML()
    }

}

const deleteColumn = (columnName) => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
        , hash = Number(getWindowHash().slice(1))
        , getDesk = store.get(hash)
    getDesk.onsuccess = () => {
        let result = getDesk.result
            , columnsArr = result.columns
            , column = columnsArr.findIndex(item => item.column_name == columnName)
        columnsArr.splice(column, 1)
        store.put(result)
        router()
    }
    // let result = getAll.result
    //     , deskIndex = result.findIndex(item => item.id == hash)
    //     , resColumns = result[deskIndex].columns
    //     , resColumn = resColumns.findIndex(item => item.column_name == columnName)

}
