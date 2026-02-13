export interface Renderer {
    'renderText': RenderType;
    'renderFixations': RenderType;
    'renderIndices': RenderType;
    'renderBoxes': RenderType;
    'renderLines': RenderType;
    'renderIO': RenderType;
    'renderAll': () => void;
    'textImage': HTMLImageElement;
}

export interface RenderType {
    'render': () => void;
}

export interface ImageSlice {
    /**
     * The x offset from the top left corner in the original image
     */
    'x': number;

    /**
     * The y offset from the top left corner in the original image
     */
    'y': number;

    /**
     * The original height of the image
     */
    'height': number;

    /**
     * The original width of the image
     */
    'width': number;
    /**
     * Scale down the image according to the editor's scale factor
     */
    'scale': boolean;
}
