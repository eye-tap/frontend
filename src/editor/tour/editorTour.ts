import {
    type ITourStep, type VTourExposedMethods
} from '@globalhive/vuejs-tour';
import {
    type Ref, ref
} from 'vue';


// To change theme, follow this guide: https://globalhive.github.io/vuejs-tour/guide/css-theme.html


export const useEditorTour = ( tour: Ref<VTourExposedMethods | null> ) => {
    const showWelcomeTour = ref( !localStorage.getItem( 'welcomeTourViewed' ) );
    const steps: ITourStep[] = [
        {
            'target': '#tour-editor',
            'content': '<h3>Editor</h3><p>This is the Editor. Pressing a letter on your keyboard will assign the selected point to the closest appearance of that letter. Alternatively, you may click the desired letter, or drag the point to the correct letter.</p>',
            'highlight': true,
            'backdrop': true
        },
        {
            'target': '#tour-history',
            'content': '<h3>History</h3><p>Undo (Ctrl + Z) and redo (Ctrl + Y) your actions. <br> Press (Ctrl + S) to save</p>',
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
            'target': '#tour-properties',
            'content': '<h3>Legend</h3><p>The Legend shows the current meaning of fixation colours. Click a colour here to change it. </p>',
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

    const startFullTour = () => {
        if ( tour.value ) {
            tour.value.startTour();
            localStorage.setItem( 'welcomeTourViewed', 'true' );
            showWelcomeTour.value = false;
        } else {
            console.log( 'Tour element missing' );
        }
    };

    return {
        steps,
        showWelcomeTour,
        startFullTour
    };
};
