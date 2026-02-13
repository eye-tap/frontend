import type {
    Renderer
} from '../types/renderer';
import {
    mouseMoveHandler
} from './move';

export const editorSessionManager = ( renderer: Renderer ) => {
    mouseMoveHandler( renderer );
};
