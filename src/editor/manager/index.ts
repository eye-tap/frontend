import type {
    Renderer
} from '../types/renderer';
import {
    mouseClickHandler
} from './click';
import {
    mouseMoveHandler
} from './move';

/**
 * Starts the needed managers
 * @param renderer - The renderer, used to handle updates
 */
export const editorSessionManager = ( renderer: Renderer ) => {
    mouseMoveHandler( renderer );
    mouseClickHandler( renderer );
};
