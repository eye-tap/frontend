import {
    type Ref,
    onMounted,
    onUnmounted
} from 'vue';
import {
    computeScaleFactor,
    scalingFactor
} from './scaling';
import {
    drawBoxes,
    drawHoveredBox,
    drawNearbyBoxes
} from './boxes';
import {
    referenceCanvasSize,
    showBoundingBoxes,
    showGazePoints,
    showHoveredBoundingBox,
    showLines,
    showNearbyBoundingBoxes,
    showPointIndex
} from '../../config';
import {
    drawLines
} from './lines';
import {
    drawPoints
} from './points';
import {
    renderData as rd
} from '../internal-data';

const useRenderer = ( canvas: Ref<HTMLCanvasElement | null> ) => {
    const redraw = () => {
        const target = canvas.value!.parentElement!;

        if ( !rd.ctx ) return;

        computeScaleFactor( referenceCanvasSize.value.width, target.clientWidth );

        rd.ctx.clearRect( 0, 0, rd.ctx.canvas.width, rd.ctx.canvas.height );

        // Scaling
        if ( rd.img ) {
            rd.ctx.canvas.width = rd.img!.width * scalingFactor.value;
            rd.ctx.canvas.height = rd.img!.height * scalingFactor.value;
            rd.ctx.drawImage( rd.img, 0, 0, rd.ctx.canvas.width, rd.ctx.canvas.height );
        } else {
            rd.ctx.canvas.width = target.clientWidth;
            rd.ctx.canvas.height = target.clientHeight;
        }

        if ( showGazePoints.value ) drawPoints();

        if ( showPointIndex.value ) drawPoints();

        if ( showLines.value ) drawLines();

        if ( showBoundingBoxes.value ) {
            drawBoxes();

            if ( showNearbyBoundingBoxes.value ) drawNearbyBoxes();
        }

        if ( showHoveredBoundingBox.value ) drawHoveredBox();
    };

    onMounted( () => {
        const c = canvas.value!;

        if ( !rd.ctx ) {
            rd.ctx = c.getContext( '2d' );
            c.width = 1920;
            c.height = 1080;
        }

        window.addEventListener( 'resize', () => redraw() );
        c.parentElement!.addEventListener( 'resize', () => redraw() );
    } );

    onUnmounted( () => {
        rd.ctx = null;
        window.removeEventListener( 'resize', () => redraw() );
    } );

    return {
        redraw
    };
};

export {
    useRenderer
};
