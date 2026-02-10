import type {
    AnnotationDto
} from '@/editor/types/dtos/AnnotationDto.ts';
import type {
    AnnotationsMetaDataDto
} from '@/editor/types/dtos/AnnotationsMetaDataDto.ts';
import type {
    ShallowReadingSessionDto
} from '@/editor/types/dtos/ShallowReadingSessionDto.ts';

export interface AnnotationSessionDto {
    'id'?: number;
    'annotator'?: number;
    'annotations'?: AnnotationDto[];
    'annotationsMetaData'?: AnnotationsMetaDataDto;
    'readingSession'?: ShallowReadingSessionDto;
}
