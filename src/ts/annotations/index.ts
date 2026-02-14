import type {
    AnnotationSessionDto
} from '@/types/dtos/AnnotationSessionDto';
import type {
    ShallowAnnotationSessionDto
} from '@/types/dtos/ShallowAnnotationSessionDto';
import request from '../util/request';

const list = async (): Promise<ShallowAnnotationSessionDto[]> => {
    const data = await request.get( '/annotation/session' );

    return JSON.parse( data ) as ShallowAnnotationSessionDto[];
};

const getSessionById = async ( sessionId: number ): Promise<AnnotationSessionDto[]> => {
    const data = await request.get( '/annotation/session/' + sessionId );

    return JSON.parse( data ) as AnnotationSessionDto[];
};

export default {
    list,
    getSessionById
};
