import {
    type Ref, ref
} from 'vue';
import {
    type VTourExposedMethods
} from '@globalhive/vuejs-tour';
import {
    configPreset
} from '../config-presets';
import {
    stepsBasic
} from './tourSteps/basic';
import {
    stepsFull
} from './tourSteps/full';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';


// To change theme, follow this guide: https://globalhive.github.io/vuejs-tour/guide/css-theme.html
export const useEditorTour = ( tour: Ref<VTourExposedMethods | null> ) => {
    const showWelcomeTour = ref( !localStorage.getItem( 'welcomeTourViewed' ) );
    const state = useAnnotationSessionStore();

    state.showingTour = showWelcomeTour.value;

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
        'steps': configPreset.value == 'basic' ? stepsBasic : stepsFull,
        showWelcomeTour,
        startFullTour
    };
};
