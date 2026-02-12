import {
    type Ref,
    onMounted
} from 'vue';
import {
    addToHistory,
    redo,
    undo
} from './history-backend';
import {
    boxIndex,
    isCharacterKey,
    isRedoCmd,
    isUndoCmd,
    pointDistance
} from './util';
import {
    boxes,
    cursorLine,
    filteredPoints,
    highlightedBoxIndex,
    mousePosition,
    pointSelected,
    selectedPoint
} from '../internal-data';
import type {
    EditorPoint
} from '../../types/editor';
import {
    scaleInverse
} from '../rendering/scaling';

const useEditorIO = (
    canvas: Ref<HTMLCanvasElement | null>,
    redraw: () => void
) => {
    const annotatedPoints = new Set();

    let isDragging = false;

    const selectPoint = ( p: EditorPoint, relativeIndex: number ) => {
        const points = filteredPoints.value;
        const currentIndex = points.indexOf( p );

        if ( currentIndex === -1 ) return null;

        let i = ( currentIndex + relativeIndex ) % points.length;

        while ( i !== currentIndex ) {
            const nextPoint = points[i]!;

            if ( nextPoint.annotedbox === null ) {
                pointSelected.isTrue = true;

                return nextPoint;
            }

            i = ( i + 1 ) % points.length;
        }

        pointSelected.isTrue = false;

        return null;
    };

    const onKeyDown = ( e: KeyboardEvent ) => {
        if ( e.key === 'Backspace' || e.key === 'Delete' ) {
            undo( redraw );
        } else if ( e.key === 'ArrowRight' ) {
            if ( selectedPoint.value ) {
                selectedPoint.value = selectPoint( selectedPoint.value, 1 ) || null;
                redraw();
            }
        } else if ( e.key === 'ArrowLeft' ) {
            if ( selectedPoint.value ) {
                selectedPoint.value = selectPoint( selectedPoint.value, -1 ) || null;
                redraw();
            }
        } else if ( isUndoCmd( e ) ) {
            undo( redraw );
        } else if ( isRedoCmd( e ) ) {
            redo( redraw );
        } else if ( isCharacterKey( e.key ) ) {
            const char = e.key.toLowerCase();

            let closestBoxDistance = Infinity;
            let closestBoxIdx = null;

            for ( let i = 0; i < boxes.boxes.length; i++ ) {
                const box = boxes.boxes[i]!;

                if ( box.character.toLowerCase() === char ) {
                    const distance = Math.hypot( box.centerX - selectedPoint.value!.x, box.centerY - selectedPoint.value!.y );

                    if ( distance < closestBoxDistance ) {
                        closestBoxDistance = distance;
                        closestBoxIdx = i;
                    }
                }
            }

            if ( closestBoxIdx !== null ) {
                const pointIndex = filteredPoints.value.indexOf( selectedPoint.value! );

                if ( pointIndex !== -1 ) {
                    addToHistory( pointIndex, pointIndex );
                }

                selectedPoint.value!.annotedbox = closestBoxIdx;

                selectedPoint.value = selectPoint( selectedPoint.value!, 1 ) || null;
                redraw();
            }
        }
    };


    //          ╭───────────────────────────────────────────────╮
    //          │                     MOUSE                     │
    //          ╰───────────────────────────────────────────────╯

    const onMouseDown = ( e: MouseEvent ) => {
        const {
            x, y
        } = getMousePos( e );

        if ( pointSelected.isTrue && highlightedBoxIndex.value != null ) {
            const pointIdx = filteredPoints.value.indexOf( selectedPoint.value! );

            if ( !annotatedPoints.has( pointIdx ) ) {
                annotatedPoints.add( pointIdx );
            }

            addToHistory( pointIdx, pointIdx );
            selectedPoint.value!.annotedbox = highlightedBoxIndex.value;
            selectedPoint.value = selectPoint( selectedPoint.value!, 1 ) || null;
            redraw();

            return;
        } else {
            let cpoint = Infinity;
            let distance = 0;

            pointSelected.isTrue = false;

            for ( const p of filteredPoints.value ) {
                distance = pointDistance( p, x, y );

                if ( distance < cpoint ) {
                    selectedPoint.value = p;
                    cpoint = distance;
                    isDragging = true;
                    pointSelected.isTrue = true;
                }
            }
        }
    };

    const onMouseMove = ( e: MouseEvent ) => {
        const {
            x, y
        } = getMousePos( e );

        if ( isDragging && selectedPoint.value ) {
            cursorLine.value = {
                'x1': selectedPoint.value.x,
                'y1': selectedPoint.value.y,
                'x2': x,
                'y2': y
            };
        }

        highlightedBoxIndex.value = boxIndex( x, y, boxes.boxes );

        redraw();
    };

    const onMouseUp = () => {
        if ( isDragging && selectedPoint.value ) {
            const pointIdx = filteredPoints.value.indexOf( selectedPoint.value );

            if ( highlightedBoxIndex.value != null ) {
                if ( !annotatedPoints.has( pointIdx ) ) {
                    annotatedPoints.add( pointIdx );
                }

                addToHistory( pointIdx, pointIdx );
                selectedPoint.value.annotedbox = highlightedBoxIndex.value;
                highlightedBoxIndex.value = 0;
                selectedPoint.value = selectPoint( selectedPoint.value, 1 ) || null;
            } else {
                addToHistory( pointIdx, pointIdx );
                selectedPoint.value.annotedbox = null;
            }

            cursorLine.value = null;
            redraw();
        }

        isDragging = false;
    };

    const getMousePos = ( e: MouseEvent ) => {
        if ( !canvas.value ) {
            mousePosition.value = {
                'x': 0,
                'y': 0
            };

            console.warn( 'Mouse positioning failure' );

            return mousePosition.value;
        }

        const rect = canvas.value!.getBoundingClientRect();

        mousePosition.value = {
            'x': scaleInverse( e.clientX - rect.left ),
            'y': scaleInverse( e.clientY - rect.top )
        };

        return mousePosition.value;
    };

    onMounted( () => {
        const c = canvas.value!;

        c.addEventListener( 'mousedown', e => onMouseDown( e ) );
        c.addEventListener( 'mousemove', e => onMouseMove( e ) );
        c.addEventListener( 'mouseup', () => onMouseUp() );
        c.addEventListener( 'keydown', e => onKeyDown( e ) );
    } );
};

export {
    useEditorIO
};
