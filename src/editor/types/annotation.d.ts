export interface EditorAnnotation {
    /**
     * The fixation index, i.e. index in the fixations array
     */
    'fixationId': number;

    /**
     * The box index, i.e. index in the boundingBoxes array
     */
    'boxId': number;
}

export interface EditorPoint {
    'x': number;
    'y': number;
}
