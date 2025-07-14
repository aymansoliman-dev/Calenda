class MobileTabsHandler {
    constructor() {
        this.tabs = document.querySelectorAll('#tasks-tabs .label');
        this.tasksColumns = document.querySelectorAll('.tasks-column');
    }

    initiate() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active column
                const selectedState = tab.dataset.link;
                this.tasksColumns.forEach(column => {
                    column.classList.toggle('active', column.querySelector('.cards-column')?.dataset.state === selectedState);
                });
            });
        });

        const activeTab = document.querySelector('#tasks-tabs .label.active');
        if (activeTab) {
            const selectedState = activeTab.dataset.link;
            this.tasksColumns.forEach(column => {
                column.classList.toggle('active', column.querySelector('.cards-column')?.dataset.state === selectedState);
            });
        }
    }
}

export { MobileTabsHandler };