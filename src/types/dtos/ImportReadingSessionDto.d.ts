import type {
    ImportFixationDto
} from '@/types/dtos/ImportFixationDto';
import type {
    ImportPreAnnotationDto
} from '@/types/dtos/ImportPreAnnotationDto';

export interface ImportReadingSessionDto {
    'fixations'?: ImportFixationDto[];
    'readerForeignId'?: number;
    'textForeignId'?: number;
    'language'?: string;
    'preAnnotations'?: ImportPreAnnotationDto[];
}
