/**
 * @deprecated To be replaced with boxes/BoundingBox
 */
export interface Boxes {
    'x1': number;
    'x2': number;
    'y1': number;
    'y2': number;
}

/**
 * @deprecated Replaced with boxes/CharacterBoundingBox
 */
export interface LoadedBoxes extends Boxes {
    'character': string;
}

/**
 * @deprecated to be replaced with boxes/EditorCharacterBoundingBox
 */
export interface BoundingBoxes extends Boxes {
    'centerX': number;
    'centerY': number;
    'nearbyPoints': number[];
    'character': string;
}

/**
 * @deprecated No direct replacement (closest being fixations/Fixation)
 */
export interface RawPoint {
    'x': number;
    'y': number;
}

/**
 * @deprecated Replaced with editor/Line
 */
export interface RawLine {
    'x1': number;
    'x2': number;
    'y1': number;
    'y2': number;
}

/**
 * Represents a line drawn by the user
 */
export interface Line {
    'x1': number;
    'x2': number;
    'y1': number;
    'y2': number;
}

// TODO: Think how to handle this (we have fixations/Annotation as a likely option)
/**
 * @deprecated Replaced with fixations/Annotation (TODO!)
 */
export interface EditorPoint {
    'reader': number;
    'x': number;
    'y': number;
    'annotedbox': null | number | string
}
