import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';
import type {
    WordBoundingBoxDto
} from '@/types/dtos/WordBoundingBoxDto';

export interface TextDto {
    'id'?: number;
    'title'?: string;
    'wordBoundingBoxes'?: WordBoundingBoxDto[];
    'characterBoundingBoxes'?: CharacterBoundingBoxDto[];
    'backgroundImage'?: string;
}
