export interface Renderer {
    'renderText': RenderType;
    'renderFixations': RenderType;
    'renderBoxes': RenderType;
    'renderLines': RenderType;
    'renderAll': () => void;
    'textImage': HTMLImageElement;
}

export interface RenderType {
    'render': () => void;
}
