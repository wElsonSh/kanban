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
    alert("БД удалось успешно открыть!", openDB.result)
    console.log(db);

    const transaction = db.transaction("desks", "readwrite")
        , store = transaction.objectStore("desks")
        , clearRequest = store.clear()

    clearRequest.onsuccess = () => {
        store.add({ name: "Телефон", price: 10000 })
    }

    transaction.oncomplete = () => {
        console.log('Данные успешно отправлены...');

        const readTransaction = db.transaction("desks", "readonly")
            , readStore = readTransaction.objectStore("desks")
            , getAllData = readStore.getAll()

        getAllData.onsuccess = () => {
            console.log(getAllData.result);

        }

    }
}


