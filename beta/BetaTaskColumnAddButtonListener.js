class BetaTaskColumnAddButtonListener {
    constructor(taskCreatorInstance) {
        this.taskCreator = taskCreatorInstance;
        this.addButtons = document.querySelectorAll('.add-task-button');
    }

    attach() {
        this.addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const ul = button.parentElement.querySelector('.cards-column')?.querySelector('ul');
                if (!ul) return;
                this.taskCreator.popup("Add task", null, true, ul);
            });
        });
    }
}

export { BetaTaskColumnAddButtonListener };
