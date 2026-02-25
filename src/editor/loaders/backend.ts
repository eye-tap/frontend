import {
    type Ref,
    ref
} from 'vue';
import {
    annotations,
    boundingBoxes,
    fixations,
    selectedFixation
} from '../data';
import type {
    AnnotationSessionDto
} from '@/types/dtos/AnnotationSessionDto';
import type {
    EditorAnnotation
} from '../types/annotation';
import type {
    Renderer
} from '../types/renderer';
import annotationManager from '@/ts/annotations';
import {
    sendLoadEvent
} from './event';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const sessionData: Ref<AnnotationSessionDto> = ref( {} );

export const loadEditorDataFromBackend = async ( renderer: Renderer ) => {
    const session = useAnnotationSessionStore();

    sessionData.value = await annotationManager.getSessionById( session.sessionIds[ session.sessionIdx ]!.sessionId );
    // Load image
    const img = sessionData.value.readingSession!.textDto!.backgroundImage!;

    renderer.textImage.src = 'data:image/jpg;base64,' + img;

    // Load fixations
    const fix = sessionData.value.readingSession!.fixations!;

    fixations.value = [];
    fix.forEach( f => {
        fixations.value.push( {
            'x': f.x!,
            'y': f.y!,
            'id': f.id!,
            'assigned': 'unassigned',
            'disagreement': f.disagreement
        } );
    } );

    // Load bounding boxes
    const bb = sessionData.value.readingSession!.textDto!.characterBoundingBoxes!;

    boundingBoxes.value = [];
    bb.forEach( b => {
        boundingBoxes.value.push( {
            ...b,
            'centerX': ( b.xMin! + b.xMax! ) / 2,
            'centerY': ( b.yMin! + b.yMax! ) / 2,
            'nearbyPoints': [],
            'highlightClass': 'none'
        } );
    } );

    // Load annotations
    const annotationLoad = sessionData.value.annotations!;

    annotations.value = [];

    if ( annotationLoad )
        annotationLoad.forEach( annotation => {
            // TODO: Need algorithm name. Editor's Annotation object already supports it
            const ann: EditorAnnotation = {
                'fixationId': getFixIdxFromId( annotation.fixation!.id! ),
                'boxId': getBoxIdxFromId( annotation.characterBoundingBox!.id! )
            };

            fixations.value[ ann.fixationId ]!.assigned = annotation.annotationType === 'ANNOTATED' ? 'assigned' : 'machine';

            annotations.value.push( ann );

            // NOTE: To use other disagreement measures, compute here
        } );

    selectedFixation.value = 0;

    if ( fixations.value[ 0 ]!.assigned !== 'unassigned' ) {
        for ( let i = 1; i < fixations.value.length; i++ ) {
            if ( fixations.value[ i ]!.assigned === 'unassigned' ) {
                selectedFixation.value = i;
                break;
            }
        }
    }

    // If you do not want to diplay the reader, delete it here
    const data = session.sessionIds[ session.sessionIdx ]!;

    // let title = data.title ? `${ data.title }, reader ${ data.reader }` : 'EyeTAP';
    let title = data.desc ?? 'EyeTAP';

    if ( fixations.value[ selectedFixation.value ]!.assigned !== 'unassigned' )
        title += ' (complete)';

    sendLoadEvent( title );
};

const getBoxIdxFromId = ( id: number ) => {
    for ( let i = 0; i < boundingBoxes.value.length; i++ ) {
        if ( boundingBoxes.value[i]!.id === id )
            return i;
    }

    return -1;
};

const getFixIdxFromId = ( id: number ) => {
    for ( let i = 0; i < fixations.value.length; i++ ) {
        if ( fixations.value[i]!.id === id )
            return i;
    }

    return -1;
};
