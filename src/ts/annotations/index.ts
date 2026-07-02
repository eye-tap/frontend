import type {
    AnnotationSessionDto
} from '@/types/dtos/AnnotationSessionDto';
import type {
    EditAnnotationsDto
} from '@/types/dtos/EditAnnotationsDto';
import type {
    ShallowAnnotationSessionDto
} from '@/types/dtos/ShallowAnnotationSessionDto';
import request from '../util/request';
import {
    setConfigPreset
} from '@/editor/config-presets';

/**
 * List all annotation sessions from the backend for current user
 * @returns A list of all AnnotationSessions for current user
 */
const list = async (): Promise<ShallowAnnotationSessionDto[]> => {
    const data = JSON.parse( await request.get( '/annotation/session' ) ) as ShallowAnnotationSessionDto[];

    if ( data[0] && data[0].furtherOptions ) {
        const details = JSON.parse( data[0].furtherOptions );

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

/**
 * Get the full annotation session from backend by its ID (includes image)
 * @param sessionId - The annotation sessionId to retrieve
 * @returns The parsed annotation session
 */
const getSessionById = async ( sessionId: number ): Promise<AnnotationSessionDto> => {
    const data = await request.get( '/annotation/session/' + sessionId );

    return JSON.parse( data ) as AnnotationSessionDto;
};

/**
 * Save annotation session changes to the backend
 * @param data - The edited annotations. Each record is pair of numbers
 * @param sessionId - The annotation session Id to save for
 */
const save = async ( data: EditAnnotationsDto, sessionId: number ) => {
    const response = await request.post( '/annotation/' + sessionId, data )
        .then( res => res.text() );

    return JSON.parse( response ) as AnnotationSessionDto;
};

const autoSaveOnUnload = ( data: EditAnnotationsDto, sessionId: number ) => {
    ( async () => {
        request.beaconRequest( '/annotation/' + sessionId, JSON.stringify( data ) );
    } )();
};

export default {
    list,
    getSessionById,
    save,
    autoSaveOnUnload
};
