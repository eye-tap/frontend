import type {
    Ref
} from 'vue';
import type {
    Renderer
} from '../types/renderer';
import {
    boxesRenderer
} from './boxes';
import {
    fixationRenderer
} from './fixations';
import {
    linesRenderer
} from './lines';
import {
    textRenderer
} from './text';

export const renderer = (
    textCanvas: Ref<HTMLCanvasElement | null>,
    boxesCanvas: Ref<HTMLCanvasElement | null>,
    linesCanvas: Ref<HTMLCanvasElement | null>,
    fixationsCanvas: Ref<HTMLCanvasElement | null>
): Renderer => {
    const textImage = document.createElement( 'img' );
    const text = textRenderer( textCanvas, textImage );
    const fix = fixationRenderer( fixationsCanvas );
    const box = boxesRenderer( boxesCanvas, textImage );
    const lines = linesRenderer( linesCanvas );

    const renderAll = async () => {
        await text.render();
        box.render();
        fix.render();
        lines.render();
    };

    return {
        'renderText': text,
        'renderFixations': fix,
        'renderBoxes': box,
        'renderLines': lines,
        renderAll,
        textImage
    };
};
