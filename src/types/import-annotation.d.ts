import type {
    ImportPreAnnotationDto
} from './dtos/ImportPreAnnotationDto';

export interface ImportAnnotation {
    [reader: string]: ImportPreAnnotationDto
}
