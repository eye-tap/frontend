import type {
    Renderer
} from '../types/renderer';

let renderer: Renderer | null = null;

export const setRenderer = ( rendererObj: Renderer ) => {
    renderer = rendererObj;
};

export const getRenderer = () => {
    return renderer!;
};
