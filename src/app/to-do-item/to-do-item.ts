export class ToDoItem {
    constructor(
        public id: number, 
        public title: string,
        public date: string, 
        public complete: boolean,
        public selected: boolean) {
    }
}