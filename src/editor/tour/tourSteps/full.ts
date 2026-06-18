import type {
    ITourStep
} from '@globalhive/vuejs-tour';

export const stepsFull: ITourStep[] = [
    {
        'target': '#tour-editor',
        'content': '<h3>Editor</h3><p>This is the Editor. Pressing a letter on your keyboard will assign the selected point to the closest appearance of that letter. If you press shift and the letter, it will assign the <b>second</b> closest letter. Alternatively, you may click the desired letter, or drag the point to the correct letter.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-history',
        'content': '<h3>History</h3><p>Undo (Ctrl + Z) and redo (Ctrl + Y) your actions. <br> Press (Ctrl + S) to save. You can mark a fixation as invalid (Shift + Backspace) by clicking the cross symbol</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-options',
        'content': '<h3>Options</h3><p>Here you can change the settings for the editor.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-keybinds',
        'content': '<h3>Keybinds</h3><p>Here you can get an overview over the provided keybinds.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-preferences',
        'content': '<h3>Preferences</h3><p>Click the gear icon to view advanced editor options.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-finale',
        'content': `
            <div class="tour-final-content">
            <div class="tour-final-emoji">🚀</div>
            <h2>You’re Ready!</h2>
            <p>
             You now know how to use the Eye-TAP Editor.
            </p>
            <p class="tour-final-sub">
             Enjoy annotating!
            </p>
            </div>
            `,
        'backdrop': true
    }
];
