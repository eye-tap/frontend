import type {
    AnnotationDto
} from '@/types/dtos/AnnotationDto.ts';
import type {
    AnnotationsMetaDataDto
} from '@/types/dtos/AnnotationsMetaDataDto.ts';
import type {
    ReadingSessionDto
} from '@/types/dtos/ReadingSessionDto.ts';

export interface AnnotationSessionDto {
    'id'?: number;
    'annotator'?: number;
    'annotations'?: AnnotationDto[];
    'annotationsMetaData'?: AnnotationsMetaDataDto;
    'readingSession'?: ReadingSessionDto;
}
