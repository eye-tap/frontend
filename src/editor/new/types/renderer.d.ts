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
