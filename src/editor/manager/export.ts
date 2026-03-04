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

const CSV_HEADER = 'fixation_id,box_id';

const createCsv = () => {
    const rows = annotations.value.map( annotation => {
        const fixationId = fixations.value[ annotation.fixationIdx ]?.id ?? annotation.fixationIdx;
        const boxId = boundingBoxes.value[ annotation.boxIdx ]?.id ?? annotation.boxIdx;

        return `${ fixationId },${ boxId }`;
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
