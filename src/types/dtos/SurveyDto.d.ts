import type {
    ShallowAnnotationSessionDto
} from '@/types/dtos/ShallowAnnotationSessionDto.ts';

export interface SurveyDto {
    'id'?: number;
    'userIds'?: number[];
    'title'?: string;
    'description'?: string;
    'annotationSessions'?: ShallowAnnotationSessionDto[];
}
