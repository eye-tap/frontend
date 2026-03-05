import type {
    Renderer
} from '../types/renderer';

let renderer: Renderer | null = null;

// Used to give other functions easier access to the renderer
export const setRenderer = ( rendererObj: Renderer ) => {
    renderer = rendererObj;
};

export const getRenderer = () => {
    return renderer!;
};
