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

/**
 * List all annotation sessions from the backend for current user
 * @returns A list of all AnnotationSessions for current user
 */
const list = async (): Promise<ShallowAnnotationSessionDto[]> => {
    const data = await request.get( '/annotation/session' );

    return JSON.parse( data ) as ShallowAnnotationSessionDto[];
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
    await request.post( '/annotation/' + sessionId, data );
};

export default {
    list,
    getSessionById,
    save
};
