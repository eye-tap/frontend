import type {
    CharacterBoundingBoxDto
} from '@/types/dtos/CharacterBoundingBoxDto';

export interface EditorCharacterBoundingBox extends CharacterBoundingBoxDto {
    'centerX': number;
    'centerY': number;
    'nearbyPoints': number[];
    'highlightClass': 'nearby' | 'hovered' | 'proximity' | 'highlight' | 'none';
}

export interface Color {
    'r': number,
    'g': number,
    'b': number
}
