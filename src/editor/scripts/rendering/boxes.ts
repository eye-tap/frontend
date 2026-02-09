import {
    boundingBoxColor, boundingBoxOnHoverRadius, boundingBoxStrokeWidth, hightlightedBoxColor,
    proximityBoxColor,
    showBoxesOnHover
} from '../../config';
import {
    boxes,
    highlightedBoxIndex,
    mousePosition,
    renderData as rd
} from '../internal-data';
import type {
    Boxes
} from '../../types/editor';
import {
    scale
} from './scaling';

const drawBoxes = () => {
    rd.ctx!.lineWidth = scale( boundingBoxStrokeWidth.value );

    for ( let i = 0; i < boxes.boxes.length; i++ ) {
        const box = boxes.boxes[ i ]!;

        if ( !showBoxesOnHover.value || isBoxNearMouse( box ) ) {
            rd.ctx!.strokeStyle = boundingBoxColor.value;
            rd.ctx!.strokeRect( scale( box.x1 ), scale( box.y1 ), scale( box.x2 - box.x1 ), scale( box.y2 - box.y1 ) );
        }
    }
};

const isBoxNearMouse = ( box: Boxes ) => {
    const centerX = Math.round( ( box.x1 + box.x2 ) / 2 );
    const centerY = Math.round( ( box.y1 + box.y2 ) / 2 );

    return Math.sqrt( ( ( mousePosition.value.x - centerX ) ** 2 )
        + ( ( mousePosition.value.y - centerY ) ** 2 ) ) < boundingBoxOnHoverRadius.value;
};

const drawHoveredBox = () => {
    const box = boxes.boxes[ highlightedBoxIndex.value! ];

    if ( !box ) return;

    rd.ctx!.strokeStyle = hightlightedBoxColor.value;
    rd.ctx!.lineWidth = scale( boundingBoxStrokeWidth.value );
    rd.ctx!.strokeRect( scale( box.x1 ), scale( box.y1 ), scale( box.x2 - box.x1 ), scale( box.y2 - box.y1 ) );
};

const drawNearbyBoxes = () => {
    const box = boxes.boxes[ highlightedBoxIndex.value! ];

    if ( !box ) return;

    rd.ctx!.lineWidth = scale( boundingBoxStrokeWidth.value );
    rd.ctx!.strokeStyle = proximityBoxColor.value;

    for ( const nearbyIndex of box.nearbyPoints ) {
        const nearbyBox = boxes.boxes[nearbyIndex]!;

        rd.ctx!.strokeRect(
            scale( nearbyBox.x1 ),
            scale( nearbyBox.y1 ),
            scale( nearbyBox.x2 - nearbyBox.x1 ),
            scale( nearbyBox.y2 - nearbyBox.y1 )
        );
    }
};

export {
    drawBoxes,
    drawHoveredBox,
    drawNearbyBoxes
};
