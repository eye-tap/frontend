import type {
    CharacterBoundingBoxDto
} from '@/editor/types/dtos/CharacterBoundingBoxDto.ts';
import type {
    FixationDto
} from '@/editor/types/dtos/FixationDto.ts';

export interface AnnotationDto {
    'id'?: number;
    'annotationType'?: string;
    'fixation'?: FixationDto;
    'characterBoundingBox'?: CharacterBoundingBoxDto;
}
