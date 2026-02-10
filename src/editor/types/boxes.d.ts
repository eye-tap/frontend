import type {
    CharacterBoundingBoxDto
} from './dtos/CharacterBoundingBoxDto';

export interface EditorCharacterBoundingBox extends CharacterBoundingBoxDto {
    'centerX': number;
    'centerY': number;
    'nearbyPoints': number[];
}
