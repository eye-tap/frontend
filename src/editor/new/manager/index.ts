import type {
    Renderer
} from '../types/renderer';
import {
    mouseClickHandler
} from './click';
import {
    mouseMoveHandler
} from './move';

export const editorSessionManager = ( renderer: Renderer ) => {
    mouseMoveHandler( renderer );
    mouseClickHandler( renderer );
};
