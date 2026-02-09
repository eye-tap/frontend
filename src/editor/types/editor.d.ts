export interface Boxes {
    'xMin': number;
    'xMax': number;
    'yMin': number;
    'yMax': number;
    'id': number;
}

export interface LoadedBoxes extends Boxes {
    'character': string;
}

export interface BoundingBoxes extends Boxes {
    'centerX': number;
    'centerY': number;
    'nearbyPoints': number[];
    'character': string;
}

export interface RawPoint {
    'x': number;
    'y': number;
}

export interface RawLine {
    'x1': number;
    'x2': number;
    'y1': number;
    'y2': number;
}

export interface EditorPoint {
    'reader': number;
    'x': number;
    'y': number;
    'annotedbox': null | number | string
}
