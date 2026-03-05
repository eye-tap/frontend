import {
    annotations,
    boundingBoxes,
    fixations
} from '../data';
import {
    onMounted,
    onUnmounted
} from 'vue';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

const CSV_HEADER = [
    'fixation_id',
    'box_id',
    'fixation_idx',
    'box_idx',
    'fixation_x',
    'fixation_y',
    'fixation_entropy',
    'fixation_state',
    'annotation_source',
    'box_char',
    'box_x_min',
    'box_x_max',
    'box_y_min',
    'box_y_max'
].join( ',' );

const createCsv = () => {
    const rows = annotations.value.map( annotation => {
        const fixation = fixations.value[ annotation.fixationIdx ];
        const box = boundingBoxes.value[ annotation.boxIdx ];
        const fixationId = fixation?.id ?? annotation.fixationIdx;
        const boxId = box?.id ?? annotation.boxIdx;
        const fixationEntropy = fixation?.disagreement ?? '';
        const fixationState = fixation?.assigned ?? '';
        const annotationSource = annotation.algorithm ? `machine:${ annotation.algorithm }` : 'user';
        const boxChar = box?.character ?? '';
        const boxXMin = box?.xMin ?? '';
        const boxXMax = box?.xMax ?? '';
        const boxYMin = box?.yMin ?? '';
        const boxYMax = box?.yMax ?? '';

        return [
            fixationId,
            boxId,
            annotation.fixationIdx,
            annotation.boxIdx,
            fixation?.x ?? '',
            fixation?.y ?? '',
            fixationEntropy,
            fixationState,
            annotationSource,
            boxChar,
            boxXMin,
            boxXMax,
            boxYMin,
            boxYMax
        ].join( ',' );
    } );

    return [
        CSV_HEADER,
        ...rows
    ].join( '\n' );
};

const downloadCsv = ( data: string, fileName: string ) => {
    const blob = new Blob( [ data ], {
        'type': 'text/csv;charset=utf-8;'
    } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( 'a' );

    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild( a );
    a.click();
    document.body.removeChild( a );
    URL.revokeObjectURL( url );
};

export const useExportFunction = () => {
    const session = useAnnotationSessionStore();

    const exportCsv = () => {
        const sessionId = session.sessionIds[ session.sessionIdx ]?.sessionId ?? 'current';
        const fileName = `session-${ sessionId }-annotations.csv`;

        downloadCsv( createCsv(), fileName );
    };

    onMounted( () => {
        document.addEventListener( 'eyetap:export', exportCsv );
    } );

    onUnmounted( () => {
        document.removeEventListener( 'eyetap:export', exportCsv );
    } );
};
