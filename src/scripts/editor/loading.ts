import {
    allPoints,
    boxes,
    renderData as rd
} from './data/internal-data';
import {
    bbKey, gazePointsKey, imageKey
} from './data/config';
import {
    downloadFile, downloadFileAsBlob
} from '../files/file';
import {
    parseBBoxCSV, parsePointsCSVSingleSet
} from './parser';
import {
    useActiveFileStore
} from '@/stores/activeFileStore';

const useEditorLoading = ( redraw: () => void ) => {
    const activeFile = useActiveFileStore();
    // TODO: Editor autosave
    // TODO: Save selected file to sessionStorage when setting in file store (persistance)

    const loadImageFromBackend = async () => {
        try {
            if ( !activeFile.file.files[ imageKey ] ) {
                return Promise.reject( 'ERR_IMG_LOAD_FAILED' );
            }

            const data = await downloadFileAsBlob( activeFile.file.files[imageKey]!.id );

            if ( !data ) return;

            rd.img = new Image();
            rd.img.src = URL.createObjectURL( data );

            rd.img.onload = () => {
                rd.ctx!.canvas.width = rd.img!.width;
                rd.ctx!.canvas.height = rd.img!.height;
                redraw();
            };
        } catch ( e ) {
            return Promise.reject( e );
        }
    };

    const loadPointsCSVFromBackend = async () => {
        if ( !activeFile.file.files[gazePointsKey] ) {
            return Promise.reject( 'ERR_POINTS_LOAD_FAILED' );
        }

        try {
            const pointsCSV = await downloadFile( activeFile.file.files[gazePointsKey]!.id );

            allPoints.value = parsePointsCSVSingleSet( pointsCSV );
        } catch ( e ) {
            return Promise.reject( e );
        }
    };

    const loadBBoxCSV = async () => {
        try {
            if ( !activeFile.file.files[bbKey] ) {
                return Promise.reject( 'ERR_BBOX_LOAD_FAILED' );
            }

            const text = await downloadFile( activeFile.file.files[bbKey]!.id );

            boxes.boxes = parseBBoxCSV( text );
            redraw();
        } catch ( err ) {
            console.error( 'Failed to load bounding boxes CSV:', err );

            throw new Error( 'Editor failed to load bounding boxes' );
        }
    };

    return {
        loadImageFromBackend,
        loadBBoxCSV,
        loadPointsCSVFromBackend
    };
};

export {
    useEditorLoading
};
