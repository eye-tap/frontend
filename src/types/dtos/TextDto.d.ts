import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto.ts';
import type {
    WordBoundingBoxDto
} from '@/types/dtos/WordBoundingBoxDto.ts';

export interface TextDto {
    'id'?: number;
    'title'?: string;
    'wordBoundingBoxes'?: WordBoundingBoxDto[];
    'characterBoundingBoxes'?: CharacterBoundingBoxDto[];
    'backgroundImage'?: string;
}
