import {
    type Ref,
    ref
} from 'vue';
import {
    annotations,
    boundingBoxes,
    fixations,
    selectedAlgorithm,
    selectedFixation
} from '../data';
import type {
    AnnotationDto
} from '@/types/dtos/AnnotationDto';
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

export const userAnnotations: Ref<EditorAnnotation[]> = ref( [] );

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
        const isInavlid = sessionData.value.removedFixations?.includes( f.id! ) ?? false;

        fixations.value.push( {
            'x': f.x!,
            'y': f.y!,
            'id': f.id!,
            'assigned': isInavlid ? 'invalid' : 'unassigned',
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
    userAnnotations.value = [];

    if ( annotationLoad )
        annotationLoad.forEach( annotation => {
            const ann: EditorAnnotation = {
                'fixationIdx': getFixIdxFromId( annotation.fixation!.id! ),
                'boxIdx': getBoxIdxFromId( annotation.characterBoundingBox!.id! )
            };

            fixations.value[ ann.fixationIdx ]!.assigned = annotation.annotationType === 'ANNOTATED' ? 'assigned' : 'machine';

            if ( annotation.annotationType === 'MACHINE_ANNOTATED' ) {
                userAnnotations.value.push( ann );
                ann.algorithm = 'default';
            }

            annotations.value.push( ann );

            // NOTE: To use other disagreement measures, compute here
        } );

    // Load additional algorithmic assignments
    const additionalAnnotationLoad = sessionData.value.inactiveMachineAnnotations!;

    if ( additionalAnnotationLoad ) {
        selectedAlgorithm.value = 0;
        const algos = Object.keys( additionalAnnotationLoad );

        algos.forEach( algo => {
            const details = additionalAnnotationLoad[ algo ]! as AnnotationDto;
            const ann: EditorAnnotation = {
                'fixationIdx': getFixIdxFromId( details.fixation!.id! ),
                'boxIdx': getBoxIdxFromId( details.characterBoundingBox!.id! ),
                'algorithm': algo
            };

            fixations.value[ ann.fixationIdx ]!.assigned = details.annotationType === 'ANNOTATED' ? 'assigned' : 'machine';

            annotations.value.push( ann );
        } );
    }

    selectedFixation.value = 0;

    // If none found that is unassigned, annotation is soft complete
    if ( fixations.value[ 0 ]!.assigned !== 'unassigned' ) {
        for ( let i = 1; i < fixations.value.length; i++ ) {
            if ( fixations.value[ i ]!.assigned === 'unassigned' ) {
                selectedFixation.value = i;
                break;
            }
        }
    }

    if ( fixations.value[ selectedFixation.value ]!.assigned !== 'unassigned' ) {
        for ( let i = 1; i < fixations.value.length; i++ ) {
            if ( fixations.value[ i ]!.assigned === 'machine' ) {
                selectedFixation.value = i;
                break;
            }
        }
    }

    // If you do not want to diplay the reader, delete it here
    const data = session.sessionIds[ session.sessionIdx ]!;

    // let title = data.title ? `${ data.title }, reader ${ data.reader }` : 'EyeTAP';
    let title = data.desc ?? 'EyeTAP';

    if ( fixations.value[ selectedFixation.value ]!.assigned === 'assigned' )
        title += ' (complete)';
    else if ( fixations.value[ selectedFixation.value ]!.assigned === 'machine' )
        title += ' (soft complete)';

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
