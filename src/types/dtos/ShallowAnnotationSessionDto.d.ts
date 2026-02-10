import type {
    AnnotationsMetaDataDto
} from '@/types/dtos/AnnotationsMetaDataDto.ts';
import type {
    ShallowReadingSessionDto
} from '@/types/dtos/ShallowReadingSessionDto.ts';

export interface ShallowAnnotationSessionDto {
    'id'?: number;
    'annotator'?: number;
    'annotationsMetaData'?: AnnotationsMetaDataDto;
    'readingSession'?: ShallowReadingSessionDto;
}
