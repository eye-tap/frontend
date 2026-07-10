import {
    type Ref,
    computed,
    onMounted,
    ref
} from 'vue';
import type {
    ShallowAnnotationSessionDto
} from '@/types/dtos/ShallowAnnotationSessionDto';
import request from '../util/request';
import router from '../router';
import {
    setConfigPreset
} from '@/editor/config-presets';
import {
    shuffle
} from '../util/arrays';
import testData from '@/ts/dev/ShallowAnotationSessionDtoTestData.json';
import {
    useAnnotationSessionStore
} from '../stores/annotationSessionStore';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useStatusStore
} from '../stores/status';

// TODO: Remove this from index.ts in folder
/**
 * List all annotation sessions from the backend for current user
 * @returns A list of all AnnotationSessions for current user
 */
const list = async ( surveyId: number ): Promise<ShallowAnnotationSessionDto[]> => {
    // In collab mode, simply get survey (there is no ethics stuff needed)
    if ( surveyId >= 0 ) {
        setConfigPreset( undefined, -1 );

        return JSON.parse( await request.get( '/annotation/session/survey/' + surveyId ) );
    }

    // In survey mode, ethics stuff has to be linked
    // TODO: Customizable ethics details link
    const data = JSON.parse( await request.get( '/annotation/session' ) ) as ShallowAnnotationSessionDto[];

    if ( data[0] && data[0].furtherOptions ) {
        const details = JSON.parse( data[0].furtherOptions );

        useAnnotationSessionStore().setVideoId( details[ 'video-id' ] );

        document.dispatchEvent( new CustomEvent( 'eyetap:ethics:show', {
            'detail': details[ 'video-id' ]
        } ) );

        document.addEventListener( 'eyetap:ethics:approve', () => {
            console.debug( '[ETHICS] approval received' );
            setConfigPreset( details[ 'preset' ], details[ 'timeout' ], details[ 'end-survey' ] );
        } );
    } else {
        setConfigPreset( undefined, -1 );
    }

    return data;
};

export const useAnnotationSessionManager = ( collabMode: boolean ) => {
    const store = useAnnotationSessionStore();
    const status = useStatusStore();
    const selected: Ref<ShallowAnnotationSessionDto> = ref( {
        'id': 0
    } );
    const loading = ref( false );
    const notifications = useNotification();
    const sessions: Ref<ShallowAnnotationSessionDto[]> = ref( [] );

    /**
     * Use dummy data to populate files. Doesn't link to any actual files.
     */
    const useTestData = () => {
        loading.value = true;
        const list: ShallowAnnotationSessionDto[] = testData.list;

        sessions.value = list!;
        store.setIds(
            list.map( value => {
                return {
                    'sessionId': value.id!,
                    'textId': value.readingSession!.textId!,
                    'title': value.readingSession!.textTitle!,
                    'reader': value.readingSession!.reader!,
                    'desc': `${ value.readingSession!.textTitle! }, reader ${ value.readingSession!.reader! }`
                };
            } )
        );
        notifications.notify( {
            'text': 'Populated file list using testing data for frontend dev.',
            'type': 'warn',
            'title': 'Loaded Testing Data'
        } );
        loading.value = false;
    };

    const load = () => {
        if ( status.devMode ) return useTestData();

        loading.value = true;
        list( collabMode ? store.surveyId : -1 )
            .then( list => {
                if ( list[ 0 ] && list[ 0 ].furtherOptions && JSON.parse( list[ 0 ].furtherOptions )[ 'shuffle' ] ) {
                    sessions.value = shuffle( list );
                } else {
                    sessions.value = list;
                    sessions.value.sort( ( a, b ) => {
                        if ( a.readingSession!.textId! === b.readingSession!.textId! ) {
                            return a.readingSession!.reader! - b.readingSession!.reader!;
                        }

                        return a.readingSession!.textId! - b.readingSession!.textId!;
                    } );
                }

                store.setIds(
                    sessions.value.map( value => {
                        return {
                            'sessionId': value.id!,
                            'textId': value.readingSession!.textId!,
                            'title': value.readingSession!.textTitle!,
                            'reader': value.readingSession!.reader!,
                            'desc': value.description!,
                            'completed': value.annotationsMetaData
                                ? ( ( value.annotationsMetaData.total ?? 0 ) - ( value.annotationsMetaData.invalid ?? 0 ) ) == 0
                                : false
                        };
                    } )
                );

                loading.value = false;
            } )
            .catch( e => {
                console.error( e );
                loading.value = false;
                notifications.notify( {
                    'text': 'Failed to retrieve annotation sets from the backend',
                    'type': 'error',
                    'title': 'Annotation set listing'
                } );
            } );
    };

    const select = ( selectedFile: ShallowAnnotationSessionDto ) => {
        selected.value = selectedFile;
        store.setActive( store.indexOf( selectedFile.id! ) );
    };

    const edit = () => {
        if ( store.selected )
            router.push( '/app/editor' );
    };

    const openRecent = () => {
        if ( sessions.value.length > 0 ) return;

        // Determine most recently edited, if all equal, use 0
        store.setActive( mostRecentlyEditedIdx.value );
        selected.value = sessions.value[ mostRecentlyEditedIdx.value ]!;
        edit();
    };

    const mostRecentlyEditedIdx = computed( () => {
        let mostRecentlyEdited = 0;
        let mostRecentlyEditedTime = 0;

        for ( let i = 0; i < sessions.value.length; i++ ) {
            const time = new Date( sessions.value[i]!.lastEdited! ).getTime();

            if ( time > mostRecentlyEditedTime ) {
                mostRecentlyEdited = i;
                mostRecentlyEditedTime = time;
            }
        }

        return mostRecentlyEdited;
    } );

    onMounted( () => {
        load();
    } );

    return {
        load,
        useTestData,
        loading,
        sessions,
        mostRecentlyEditedIdx,
        select,
        edit,
        openRecent,
        selected
    };
};
