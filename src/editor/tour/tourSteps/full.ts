import type {
    ITourStep
} from '@globalhive/vuejs-tour';

export const stepsFull: ITourStep[] = [
    {
        'target': '#tour-history',
        'content': '<h3>History</h3><p>Undo (Ctrl + Z) and redo (Ctrl + Y) your actions.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-invalidate',
        'content': '<h3>Invalidate</h3><p>You can mark a fixation as invalid by clicking the cross symbol (or Shift + Backspace).</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-help',
        'content': '<h3>Help</h3><p>Click here to see help and a list of available keybinds.</p>',
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
            </div>
            `,
        'backdrop': true
    }
];
