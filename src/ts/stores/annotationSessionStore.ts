import {
    type Ref,
    ref,
    watch
} from 'vue';
import {
    defineStore
} from 'pinia';

export const useAnnotationSessionStore = defineStore( 'annotationsession', () => {
    const sessionIdx = ref( -1 );
    const sessionIds: Ref<number[]> = ref( [] );
    const selected = ref( false );

    const setActive = ( idx: number ) => {
        sessionIdx.value = idx;
        selected.value = true;
    };

    const setIds = ( ids: number[] ) => {
        sessionIds.value = ids;
    };

    const indexOf = ( sessionId: number ) => {
        for ( let i = 0; i < sessionIds.value.length; i++ ) {
            if ( sessionIds.value[i] == sessionId ) {
                return i;
            }
        }

        throw new Error( 'Couldn\'t find requested file' );
    };

    const createWatchIdx = ( cb: ( val?: number, old?: number ) => void ) => {
        watch( sessionIdx, cb );
    };

    return {
        sessionIdx,
        sessionIds,
        selected,
        setActive,
        setIds,
        indexOf,
        createWatchIdx
    };
} );
