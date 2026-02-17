export interface EditorAnnotation {
    /**
     * The fixation index, i.e. index in the fixations array
     */
    'fixationId': number;

    /**
     * The box index, i.e. index in the boundingBoxes array
     */
    'boxId': number;

    /**
     * The algorithm that created it. If not set, assumes it's user-created
     */
    'algorithm'?: string;
}

export interface EditorPoint {
    'x': number;
    'y': number;
}
