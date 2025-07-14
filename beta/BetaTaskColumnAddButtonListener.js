class BetaTaskColumnAddButtonListener {
    constructor(taskCreator) {
        this.taskCreator = taskCreator;
    }

    attach() {
        const buttons = document.querySelectorAll('.add-task-button');
        console.log('[AddButton] Found:', buttons.length);
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetUl = button.closest('.tasks-column')?.querySelector('ul');
                this.taskCreator.popup("Add task", null, true, targetUl);
            });
        });
    }
}

export { BetaTaskColumnAddButtonListener };
