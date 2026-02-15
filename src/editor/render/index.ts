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
    indicesRenderer
} from './indices';
import {
    ioRenderer
} from './io';
import {
    linesRenderer
} from './lines';
import {
    setRenderer
} from './manager';
import {
    textRenderer
} from './text';
import {
    useScaler
} from './scaling';

export const renderer = (
    textCanvas: Ref<HTMLCanvasElement | null>,
    boxesCanvas: Ref<HTMLCanvasElement | null>,
    linesCanvas: Ref<HTMLCanvasElement | null>,
    fixationsCanvas: Ref<HTMLCanvasElement | null>,
    indicesCanvas: Ref<HTMLCanvasElement | null>,
    clickTaragetCanvas: Ref<HTMLCanvasElement | null>
): Renderer => {
    const textImage = document.createElement( 'img' );
    const text = textRenderer( textCanvas, textImage );
    const fix = fixationRenderer( fixationsCanvas );
    const indices = indicesRenderer( indicesCanvas );
    const box = boxesRenderer( boxesCanvas, textImage );
    const lines = linesRenderer( linesCanvas );
    const io = ioRenderer( clickTaragetCanvas );

    const renderAll = async () => {
        text.render();
        box.render();
        fix.render();
        indices.render();
        lines.render();
        io.render();
    };

    io.render();

    const renderer: Renderer = {
        'renderText': text,
        'renderFixations': fix,
        'renderIndices': indices,
        'renderBoxes': box,
        'renderLines': lines,
        'renderIO': io,
        renderAll,
        textImage
    };

    setRenderer( renderer );

    useScaler( textCanvas, renderer );

    return renderer;
};
