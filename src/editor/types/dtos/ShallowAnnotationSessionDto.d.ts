import type {
    AnnotationsMetaDataDto
} from '@/editor/types/dtos/AnnotationsMetaDataDto.ts';
import type {
    ShallowReadingSessionDto
} from '@/editor/types/dtos/ShallowReadingSessionDto.ts';

export interface ShallowAnnotationSessionDto {
    'id'?: number;
    'annotator'?: number;
    'annotationsMetaData'?: AnnotationsMetaDataDto;
    'readingSession'?: ShallowReadingSessionDto;
}
