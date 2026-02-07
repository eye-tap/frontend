import {
    computed
} from 'vue';
import {
    useTourStore
} from '@/stores/tourStore';

const tourStore = useTourStore();

export const assignTourClasses = ( id: number, extraClasses: string ) => {
    return computed( () => {
        if ( id === tourStore.getCurrentIndex && tourStore.getShown ) {
            return 'page-tour shown' + ( extraClasses !== '' ? ' ' + extraClasses : '' );
        } else {
            return 'page-tour' + ( extraClasses !== '' ? ' ' + extraClasses : '' );
        }
    } );
};
