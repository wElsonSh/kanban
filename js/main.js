const column_name = document.getElementById("column_name")
    , desk_monitor_list = document.getElementById("desk_monitor_list")
    , create_column_btn = document.getElementById("create_column_btn")
let openDB = indexedDB.open("KANBAN", 2)
    , db


openDB.onupgradeneeded = (event) => {
    db = event.target.result
    if (!db.objectStoreNames.contains("desks")) {
        db.createObjectStore("desks", {
            keyPath: "id",
            autoIncrement: true,
        })
    }
    console.log(db);
}
openDB.onerror = () => {
    alert('Чтото пошло не так: ', openDB.error)
}

openDB.onsuccess = (event) => {
    db = event.target.result
    console.log(db);


    broadcastAllData()

    create_column_btn.addEventListener('click', () => {
        createColumn(prompt("Введи название колонки:"))
    })
}


const broadcastAllData = () => {
    let transaction = db.transaction("desks", "readonly")
        , store = transaction.objectStore("desks")
        , getAllData = store.getAll()

    getAllData.onsuccess = () => {
        let allDataArray = getAllData.result
        console.log(allDataArray);

        desk_monitor_list.innerHTML = ''
        allDataArray.forEach((data, index) => {
            createDataHTML(data)
        })

    }
}

createDataHTML = (data) => {

    let columnBody = document.createElement("li")
        , columnTegsArr = [...data.tegs]
        , columnTasksArr = [...data.tasks]
    console.log(columnTegsArr);


    columnBody.className = "column"
    columnBody.innerHTML = `
                <div class="column_characteristics">
                    <div class="column_header">
                        <span class="column_name" id="column_name">${data.name}</span>
                        <button class="delete_column_btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <ul class="column_tegs" id="column_tegs_${data.id}"></ul>
                </div>
                <div class="column_content">
                    <ul class="column_content_list" id="column_content_list_${data.id}">
                        <li class="column_task_creator">
                            <button class="task_creator_btn">
                                <p>Создать задачу</p>
                            </button>
                        </li>
                    </ul>
                </div>
            `

    desk_monitor_list.appendChild(columnBody)

    let column_tegs_ID = document.getElementById(`column_tegs_${data.id}`)
    columnTegsArr.forEach(teg => {
        let column_teg = document.createElement("li")
        column_teg.className = "column_teg"
        column_teg.textContent = teg
        column_tegs_ID.appendChild(column_teg)
    })

    let column_content_list_ID = document.getElementById(`column_content_list_${data.id}`)
    columnTasksArr.forEach(task => {
        let column_task = document.createElement("li")
        column_task.className = "column_content_task"
        column_task.textContent = task
        column_content_list_ID.appendChild(column_task)
    })
}

createColumn = (ColumnName) => {
    let transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
    store.add({ name: ColumnName, tegs: [], tasks: [] })
    broadcastAllData()
}
