import {
    type Ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';
import {
    allPoints,
    filteredPoints
} from './data/internal-data';
import {
    gazePointsKey,
    useWatcher
} from './data/config';
import {
    redo,
    undo
} from './history/history';
import {
    revision,
    savedRevision
} from './data/save';
import {
    saveAnnotationProgress,
    uploadFile
} from '../files/file';
import {
    convertAnnotationsToCSV
} from '../files/annotationSave';
import router from '@/router';
import {
    useActiveFileStore
} from '@/stores/activeFileStore';
import {
    useEditorIO
} from './io';
import {
    useEditorLoading
} from './loading';
import {
    useNotification
} from '@kyvg/vue3-notification';
import {
    useRenderer
} from './rendering';
import {
    useStatusStore
} from '@/stores/status';

const notifications = useNotification();

const useEditor = (
    canvas: Ref<HTMLCanvasElement | null>
) => {
    const activeFile = useActiveFileStore();
    const status = useStatusStore();

    if ( !activeFile.fileSelected && !status.devMode ) {
        notifications.notify( {
            'text': 'No file was selected. Please select a file',
            'type': 'error',
            'title': 'Editor'
        } );

        setTimeout( () => {
            router.push( '/app' );
        }, 500 );

        return;
    } else {
        document.dispatchEvent( new CustomEvent( 'eyetap:fileload', {
            'detail': activeFile.file
        } ) );
    }

    const renderer = useRenderer( canvas );
    const loader = useEditorLoading( renderer.redraw );
    const undoAction = () => undo( renderer.redraw );
    const redoAction = () => redo( renderer.redraw );

    const exportAnnotation = () => {
        savedRevision.value = revision.value;
        const csv = convertAnnotationsToCSV( allPoints.value );

        // Save annotations
        uploadFile( new File( [ csv ], 'annotations.csv', {
            'lastModified': new Date().getTime()
        } ), activeFile.file.id, gazePointsKey );

        // Update details
        let annotatedCount = 0;

        for ( let i = 0; i < allPoints.value.length; i++ )
            if ( allPoints.value[ i ]!.annotedbox !== null )
                annotatedCount++;

        saveAnnotationProgress( {
            'assigned': annotatedCount,
            'uploaded': activeFile.file.progress!.uploaded,
            'wordCount': activeFile.file.progress!.wordCount,
            'gazePoints': activeFile.file.progress!.gazePoints,
            'annotationSetId': activeFile.file.id
        } );

        notifications.notify( {
            'text': 'Changes saved successully',
            'type': 'success',
            'title': 'Editor'
        } );
    };

    // Watcher to redraw on value updates
    useWatcher( renderer.redraw );
    watch( filteredPoints, renderer.redraw );

    onMounted( () => {
        // Add event listener for undo and redo
        document.addEventListener( 'eyetap:undo', () => undoAction() );
        document.addEventListener( 'eyetap:redo', () => redoAction() );
        document.addEventListener( 'eyetap:save', () => exportAnnotation() );

        if ( !status.devMode )
            ( async () => {
                try {
                    await loader.loadImageFromBackend();
                } catch ( e ) {
                    console.error( 'EDITOR ERROR:', e );
                    notifications.notify( {
                        'text': 'Image could not be loaded',
                        'type': 'error',
                        'title': 'Editor Startup Failure'
                    } );
                }

                try {
                    await loader.loadBBoxCSV();
                } catch ( e ) {
                    console.error( e );
                    notifications.notify( {
                        'text': 'Bounding boxes could not be loaded',
                        'type': 'error',
                        'title': 'Editor Startup Failure'
                    } );
                }

                try {
                    await loader.loadPointsCSVFromBackend();
                } catch ( e ) {
                    console.error( e );
                    notifications.notify( {
                        'text': 'Annotation points could not be loaded',
                        'type': 'error',
                        'title': 'Editor Startup Failure'
                    } );
                }
            } )();
    } );

    onUnmounted( () => {
        try {
            document.removeEventListener( 'eyetap:undo', () => undoAction() );
            document.removeEventListener( 'eyetap:redo', () => redoAction() );
            document.removeEventListener( 'eyetap:save', () => exportAnnotation() );
        } catch ( e ) {
            console.debug( 'Failed to remove event listener', e );
        }
    } );

    useEditorIO(
        canvas,
        renderer.redraw
    );

    return {
        'redraw': renderer.redraw,
        'redo': redoAction,
        'undo': undoAction
    };
};


export {
    useEditor
};
