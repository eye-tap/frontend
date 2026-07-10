import {
    type Ref,
    ref,
    watch
} from 'vue';
import type {
    AnnotationSessionDetails
} from '@/types/sessionDetails';
import {
    defineStore
} from 'pinia';
import science from '../util/science';

export const useAnnotationSessionStore = defineStore( 'annotationsession', () => {
    const sessionIdx = ref( -1 );
    const sessionIds: Ref<AnnotationSessionDetails[]> = ref( [] );
    const selected = ref( false );
    const videoId = ref( '' );
    const showingTour = ref( false );
    const surveyId = ref( -1 );

    const setActive = ( idx: number ) => {
        sessionIdx.value = idx;
        selected.value = true;
    };

    const setIds = ( ids: AnnotationSessionDetails[] ) => {
        sessionIds.value = ids;
    };

    const indexOf = ( sessionId: number ) => {
        for ( let i = 0; i < sessionIds.value.length; i++ ) {
            if ( sessionIds.value[i]!.sessionId == sessionId ) {
                return i;
            }
        }

        throw new Error( 'Couldn\'t find requested file' );
    };

    const setVideoId = ( id: string | undefined ) => {
        videoId.value = id ?? '';
    };

    const createWatchIdx = ( cb: ( val?: number, old?: number ) => void ) => {
        watch( sessionIdx, cb );
    };

    const createWatchSurveyId = ( cb: ( val?: number, old?: number ) => void ) => {
        watch( surveyId, cb );
    };

    const setCompleted = () => {
        sessionIds.value[ sessionIdx.value ]!.completed = true;
    };

    watch( showingTour, ( val, oldVal ) => {
        if ( !val && oldVal ) {
            science.save( 0, 0, 0, 0, true );
        }
    } );

    return {
        sessionIdx,
        sessionIds,
        selected,
        setActive,
        setIds,
        indexOf,
        createWatchIdx,
        setCompleted,
        videoId,
        setVideoId,
        showingTour,
        surveyId,
        createWatchSurveyId
    };
} );
