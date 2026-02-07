import {
    computed
} from 'vue';
import {
    useTourStore
} from '@/stores/tourStore';

const tourStore = useTourStore();

export const assignTourClasses = ( id: number ) => {
    return computed( () => {
        if ( id === tourStore.getCurrentIndex && tourStore.getShown ) {
            return 'page-tour shown';
        } else {
            return 'page-tour';
        }
    } );
};
