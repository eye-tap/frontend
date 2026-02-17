import {
    type ITourStep, type VTourExposedMethods
} from '@globalhive/vuejs-tour';
import {
    type Ref, ref
} from 'vue';


// TODO: To change theme, follow this guide: https://globalhive.github.io/vuejs-tour/guide/css-theme.html


export const useEditorTour = () => {
    const tour: Ref<VTourExposedMethods | null> = ref( null );
    const showWelcomeTour = ref( !localStorage.getItem( 'welcomeTourViewed' ) );
    const steps: ITourStep[] = [
        {
            'target': '#tour-editor',
            'content': '<h3>Editor</h3><p>Here you can do your annotating. Pressing a letter on your keyboard will assign the currently selected point to the closest box with that letter. Alternatively, you may click the corresponding box, or drag the point to the correct box.</p>',
            'highlight': true,
            'backdrop': true
        },
        {
            'target': '#tour-history',
            'content': '<h3>History</h3><p>Undo (Ctrl + Z) and redo (Ctrl + Y) your actions. <br> Press Ctrl + S to save</p>',
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
            'content': '<h3>Preferences</h3><p>Click the gear icon to get advanced options to change your editor settings.</p>',
            'highlight': true,
            'backdrop': true
        },
        {
            'target': '#theme-select',
            'content': '<h3>Themes</h3><p>You can change the theme of the editor here.</p>',
            'highlight': true,
            'backdrop': true
        },
        {
            'target': '#tour-properties',
            'content': '<h3>Property</h3><p>The Property pane gives you an overview of the selected point </p>',
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
             You now know everything you need to start using the tool effectively.
            </p>
            <p class="tour-final-sub">
            Good luck — and enjoy annotating!
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
        }
    };

    return {
        tour,
        steps,
        showWelcomeTour,
        startFullTour
    };
};