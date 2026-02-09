export interface BoundingBox {
    'xMax': number;
    'xMin': number;
    'yMax': number;
    'yMin': number;
}

export interface CharacterBoundingBox extends BoundingBox {
    'character': string;
    'id': number;
}

export interface EditorCharacterBoundingBox extends CharacterBoundingBox {
    'centerX': number;
    'centerY': number;
    'nearbyPoints': number[];
}
