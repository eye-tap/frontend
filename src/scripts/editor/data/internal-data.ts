import type {
    BoundingBoxes,
    EditorPoint,
    RawLine
} from '@/definitions/editor';
import {
    type Ref,
    computed, ref
} from 'vue';
import {
    filterReader
} from './config';

const allPoints: Ref<EditorPoint[]> = ref( [] );
const filteredPoints = computed( () => {
    return allPoints.value.filter( p => {
        const readerFilter = filterReader.value;
        const readerOk = !Number.isFinite( readerFilter ) || p.reader === readerFilter;

        return readerOk;
    } );
} );
// point annotation
const selectedPoint: Ref<EditorPoint | null> = ref( null );
const highlightedBoxIndex: Ref<number | null> = ref( null );
const cursorLine: Ref<RawLine | null> = ref( null );
const pointSelected = {
    'isTrue': false
};
const mousePosition = ref( {
    'x': 0,
    'y': 0
} );
const boxes: {
    'boxes': BoundingBoxes[]
} = {
    'boxes': []
};
const renderData: {
    'ctx': CanvasRenderingContext2D | null,
    'img': HTMLImageElement | null
} = {
    'ctx': null,
    'img': null
};

export {
    allPoints,
    filteredPoints,
    filterReader,
    selectedPoint,
    highlightedBoxIndex,
    cursorLine,
    pointSelected,
    boxes,
    renderData,
    mousePosition
};
