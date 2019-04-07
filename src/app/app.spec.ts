import * as ToDoApp from './app';

describe('ToDoApp', () => {
    beforeAll(() => {
        //Mock the DOM
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = `
        <template id="to-do-item-template">
            <li class="to-do-item">
                <div class="details">
                    <button class="select">
                        <i class="icon-android-checkbox-outline-blank"></i>
                    </button>
                    <div class="date"></div>
                    <div class="title"></div>
                </div>
                <div class="actions">
                </div>
            </li>
        </template>
        <main class="app">
        <form id="add-item-form" class="add-item">
            <input type="text" id="new-to-do-input" placeholder="Enter new to do task" autocomplete="off"></input>
            <button type="submit" id="add-to-do" title="Add Item"></button>
        </form>
        <section id="list-container">
            <div class="controls">
                <div class="sort">
                    <button id="toggle-sort" class="icon-with-level">
                        <i class="icon-android-arrow-down"></i>
                        <span>Newest</span>
                    </button>
                    <div class="count-container"><span id="item-count">0</span> tasks</div>
                </div>
                <div class="actions">
                    <button id="undo" hidden>
                        <i class="icon-ios-undo"></i>
                        <span>Undo</span>
                    </button>
                </div>
            </div>
            <ul id="to-do-list"></ul>
        </section>
        <div id="no-item-message" hidden>No TODO tasks! You can add one above.</div>
    </main>`;
    });

    it('must define addItem function', () => {
        expect(ToDoApp.addItem).toBeDefined();
    });

    describe('addItem', () => {
        it('should add items to the toDoList', () => {
            let prevLength = ToDoApp.getToDoList().length;
            ToDoApp.addItem(1, "Test1", new Date());
            expect(ToDoApp.getToDoList().length).toBe(prevLength + 1);
        });
        it('should prepend the item to the top if sorted in descending order', () => {
            ToDoApp.sort(true);
            ToDoApp.addItem(2, "Test2", new Date());
            let firstElemTitle = document.querySelectorAll('#to-do-list>li')[0].querySelector('.title').textContent;
            expect(firstElemTitle).toBe("Test2");
        });
        it('should append the item at the last if sorted in assending order', () => {
            ToDoApp.sort(false);
            ToDoApp.addItem(3, "Test3", new Date());
            let firstElemTitle = document.querySelectorAll('#to-do-list>li')[ToDoApp.getToDoList().length - 1].querySelector('.title').textContent;
            expect(firstElemTitle).toBe("Test3");
        });
    });

    it('must define removeItem function', () => {
        expect(ToDoApp.removeItem).toBeDefined();
    });

    describe('removeItem', () => {
        it('should reduce the item count by one', () => {
            ToDoApp.addItem(4, "Test4", new Date());
            let length = ToDoApp.getToDoList().length;
            ToDoApp.removeItem(4);
            expect(ToDoApp.getToDoList().length).toBe(length - 1);
        })
    });

    it('must define markCompleteItem function', () => {
        expect(ToDoApp.markCompleteItem).toBeDefined();
    });

    describe('markCompleteItem', () => {
        it('should mark a item as complete', () => {
            ToDoApp.addItem(5, "Test5", new Date());
            ToDoApp.markCompleteItem(5);
            expect(ToDoApp.getItemByID(5).complete).toBeTruthy();
        });
        it('should mark the item as complete in DOM', () => {
            document.querySelectorAll('#to-do-list>li')[0].classList.contains('complete');
        });
    })

});