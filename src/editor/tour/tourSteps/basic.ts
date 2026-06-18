import type {
    ITourStep
} from '@globalhive/vuejs-tour';

export const stepsBasic: ITourStep[] = [
    {
        'target': '#tour-editor',
        'content': '<h3>Editor</h3><p>This is the Editor. You can assign points by clicking the desired letter, or dragging the point to the correct letter.</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-history',
        'content': '<h3>History</h3><p>Undo and redo your actions. <br> Do not forget to save. You can mark a fixation as invalid by clicking the cross symbol</p>',
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
