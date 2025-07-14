import { DarkThemeToggleListener } from '../shared/objects/DarkThemeToggleListener.js';
import { MobileTabsHandler } from '../shared/objects/MobileTabsHandler.js';
import { BetaTaskCreator } from './BetaTaskCreator.js';

window.addEventListener('DOMContentLoaded', () => {
    console.log(
        '%c🚧 This is the BETA version of Task Master 🚧\n%cFeatures are limited. The full version is coming soon!',
        'background: #fdd835; color: #000; font-weight: bold; font-size: 16px; padding: 8px 12px; border-radius: 5px;',
        'color: #666; font-size: 14px; font-style: italic;'
    );
    console.log(
        '%c⚠️ TASK MASTER (BETA)%c\nThis version uses localStorage and is under active development.',
        'color: white; background-color: #ff5722; padding: 6px 10px; font-size: 15px; font-weight: bold; border-radius: 4px;',
        'color: #888; font-size: 13px;'
    );

    new DarkThemeToggleListener().initiate();
    new MobileTabsHandler().initiate();
    new BetaTaskCreator().initiate();
})