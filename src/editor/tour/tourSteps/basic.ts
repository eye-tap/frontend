import type {
    ITourStep
} from '@globalhive/vuejs-tour';
import {
    isSideBarCollapsed
} from '@/editor/data';

export const stepsBasic: ITourStep[] = [
    {
        'target': '#tour-history',
        'content': '<h3>History</h3><p>Undo and redo your actions. <br> Do not forget to save. You can mark a fixation as invalid by clicking the cross symbol</p>',
        'highlight': true,
        'backdrop': true
    },
    {
        'target': '#tour-invalidate',
        'content': '<h3>Invalidate</h3><p>You can mark a fixation as invalid by clicking the cross symbol.</p>',
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
        'backdrop': true,
        'onAfter': () => {
            isSideBarCollapsed.value = true;
        }
    }
];
