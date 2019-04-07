import { ToDoItem } from "./to-do-item/to-do-item";

let toDoList: Array<ToDoItem> = [];
let isDescending: boolean = true;

function updateItemCount(count: number) {
    let itemCountElem: HTMLElement = document.querySelector('#item-count');
    itemCountElem.textContent = count.toString();
}

function saveToStorage(toDoList: Array<ToDoItem>) {
    let prevList = window.localStorage.getItem('toDoList');
    window.localStorage.setItem('prevState', prevList ? prevList : JSON.stringify([]));
    window.localStorage.setItem('toDoList', JSON.stringify(toDoList));
    document.querySelector('#undo').removeAttribute('hidden');
}

function undo() {
    let prevList = JSON.parse(window.localStorage.getItem('prevState'));
    toDoList = prevList;
    render(prevList);
    window.localStorage.setItem('toDoList', JSON.stringify(prevList));
    window.localStorage.setItem('prevState', '[]');
    document.querySelector('#undo').setAttribute('hidden', 'hidden');
}

function render(toDoList: Array<ToDoItem>) {
    let listContainer: HTMLElement = document.querySelector('#list-container');
    let toDoListElem: HTMLUListElement = document.querySelector('#to-do-list');
    let emptyMessage: HTMLElement = document.querySelector('#no-item-message');

    toDoListElem.textContent = "";

    if (toDoList.length) {

        listContainer.removeAttribute('hidden');
        emptyMessage.setAttribute('hidden', 'hidden');

        updateItemCount(toDoList.length);

        toDoList.forEach((item: ToDoItem) => {
            let toDoTemplate: HTMLTemplateElement = document.querySelector('#to-do-item-template');
            let newItem = document.importNode(toDoTemplate.content, true);
            let icon = newItem.querySelector('.select>i');
            if (item.selected) {
                icon.classList.remove('icon-android-checkbox-outline-blank');
                icon.classList.add('icon-android-checkbox-outline');
            } else {
                icon.classList.remove('icon-android-checkbox-outline');
                icon.classList.add('icon-android-checkbox-outline-blank');
            }
            if (item.complete) {
                newItem.querySelector('.to-do-item').classList.add('complete');
            }
            newItem.querySelector('.to-do-item').setAttribute('id', 'item-' + item.id.toString());
            newItem.querySelector('.title').textContent = item.title;
            newItem.querySelector('.date').textContent = item.date;
            newItem.querySelectorAll('button').forEach((elem: HTMLElement) => {
                elem.setAttribute('data-id', item.id.toString());
            });
            toDoListElem.append(newItem);
        });
    } else {
        listContainer.setAttribute('hidden', 'hidden');
        emptyMessage.removeAttribute('hidden');
    }
}

function bindEvents() {
    let taskInput: HTMLInputElement = document.querySelector('#new-to-do-input');
    //Add New Item
    document.querySelector('#add-item-form').addEventListener('submit', (event) => {
        event.preventDefault();
        let taskTitle = taskInput.value;
        let date = new Date();
        if (taskTitle && taskTitle.length <= 120) {
            let itemID = Math.floor(Math.random() * 100000000);
            taskInput.classList.remove('error');
            addItem(itemID, taskTitle, date);
            taskInput.value = "";
        } else {
            taskInput.classList.add('error');
            alert("Please enter a task with less than 120 characters");
        }

    });

    document.querySelector('#clear-list').addEventListener('click', (event) => {
        toDoList = [];
        taskInput.value = "";
        render([]);
        window.localStorage.removeItem('prevState');
        window.localStorage.removeItem('toDoList');
    });

    document.querySelector('#delete-selected').addEventListener('click', (event) => {
        let selectedList = toDoList.filter(item => item.selected);
        selectedList.forEach((item) => {
            if (item.selected) {
                removeItem(item.id);
            }
        });
        document.querySelectorAll('.activate-on-select').forEach((item) => {
            item.setAttribute('hidden', 'hidden');
        });
    });

    document.querySelector('#mark-complete-selected').addEventListener('click', (event) => {
        let selectedList = toDoList.filter(item => item.selected);
        selectedList.forEach((item) => {
            if (item.selected) {
                markCompleteItem(item.id);
            }
        });
    });

    document.querySelector('#undo').addEventListener('click', (event) => {
        undo();
    })

    document.querySelector('#to-do-list').addEventListener('click', (event: any) => {
        let clickPath = event.path;
        for (let elem of clickPath) {
            if (elem.tagName === 'BUTTON') {
                let itemID = parseInt(elem.dataset['id']);
                if (elem.classList.contains('delete')) {
                    removeItem(itemID);
                } else if (elem.classList.contains('mark-complete')) {
                    markCompleteItem(itemID);
                } else if (elem.classList.contains('select')) {
                    let icon = elem.querySelector('i');
                    let item = getItemByID(itemID);
                    let activateItems = document.querySelectorAll('.activate-on-select');
                    if (item.selected) {
                        item.selected = false;
                        icon.classList.remove('icon-android-checkbox-outline');
                        icon.classList.add('icon-android-checkbox-outline-blank');
                    } else {
                        item.selected = true;
                        icon.classList.remove('icon-android-checkbox-outline-blank');
                        icon.classList.add('icon-android-checkbox-outline');
                    }
                    let selectedList = toDoList.filter((item) => item.selected);
                    if (selectedList.length) {
                        activateItems.forEach((item) => {
                            item.removeAttribute('hidden');
                        });
                    } else {
                        activateItems.forEach((item) => {
                            item.setAttribute('hidden', 'hidden');
                        });
                    }
                }
                break;
            }
        }
    });

    document.querySelector('#toggle-sort').addEventListener('click', (event: any) => {
        sort(!isDescending);
    });
}

export function getItemByID(id: number) {
    for (let item of toDoList) {
        if (item.id === id) {
            return item;
        }
    }
}

export function getToDoList() {
    return toDoList;
}

export function addItem(itemID: number, title: string, date: Date) {
    let listContainer: HTMLElement = document.querySelector('#list-container');
    let toDoListElem: HTMLUListElement = document.querySelector('#to-do-list');
    let emptyMessage: HTMLElement = document.querySelector('#no-item-message');

    if (toDoList.length < 10) {        
        let newToDoItem = new ToDoItem(itemID, title, date.toDateString(), false, false);
        let toDoTemplate: HTMLTemplateElement = document.querySelector('#to-do-item-template');
        let newItem: DocumentFragment = document.importNode(toDoTemplate.content, true);
        newItem.querySelector('.to-do-item').setAttribute('id', 'item-' + itemID);
        newItem.querySelector('.title').textContent = title;
        newItem.querySelector('.date').textContent = date.toDateString();
        newItem.querySelectorAll('button').forEach((elem: HTMLElement) => {
            elem.setAttribute('data-id', itemID.toString());
        });
        if (isDescending) {
            toDoListElem.prepend(newItem);
            toDoList.unshift(newToDoItem);
        } else {
            toDoListElem.append(newItem);
            toDoList.push(newToDoItem);
        }

        updateItemCount(toDoList.length);
        saveToStorage(toDoList);

        listContainer.removeAttribute('hidden');
        emptyMessage.setAttribute('hidden', 'hidden');
    } else {
        alert("Maximum limit reached");
    }
}

export function removeItem(itemID: number) {
    let itemElem = document.querySelector('#item-' + itemID);
    let listContainer: HTMLElement = document.querySelector('#list-container');
    let emptyMessage: HTMLElement = document.querySelector('#no-item-message');

    itemElem.remove();

    for (let i = 0; i < toDoList.length; i++) {
        if (toDoList[i].id === itemID) {
            toDoList.splice(i, 1);
            break;
        }
    }

    updateItemCount(toDoList.length);
    saveToStorage(toDoList);

    if (!toDoList.length) {
        listContainer.setAttribute('hidden', 'hidden');
        emptyMessage.removeAttribute('hidden');
    }
}

export function markCompleteItem(itemID: number) {
    let item = getItemByID(itemID);
    item.complete = true;
    document.querySelector('#item-' + itemID).classList.add('complete');
    saveToStorage(toDoList);
}

export function sort(order: boolean) {
    let sortLabel = document.querySelector('#toggle-sort>span');
    isDescending = order;
    if (order) {
        sortLabel.textContent = "Newest";
    } else {
        sortLabel.textContent = "Oldest";
    }
    toDoList = toDoList.reverse();
    render(toDoList);
}

export function init() {
    let savedToDoList = window.localStorage.getItem('toDoList');
    toDoList = savedToDoList ? JSON.parse(savedToDoList) : [];
    render(toDoList);
    bindEvents();
}