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
