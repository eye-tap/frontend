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
    Renderer
} from '../types/renderer';
import annotationManager from '@/ts/annotations';
import {
    useAnnotationSessionStore
} from '@/ts/stores/annotationSessionStore';

export const sessionData: Ref<AnnotationSessionDto> = ref( {} );

export const loadEditorDataFromBackend = async ( renderer: Renderer ) => {
    const session = useAnnotationSessionStore();

    sessionData.value = await annotationManager.getSessionById( session.sessionIds[ session.sessionIdx ]! );
    // Load image
    const img = sessionData.value.readingSession!.textDto!.backgroundImage!;

    renderer.textImage.src = 'data:image/jpg;base64,' + img;

    // Load annotations
    const fixIds: number[] = [];
    const annotationLoad = sessionData.value.annotations!;

    annotations.value = [];
    annotationLoad.forEach( annotation => {
        annotations.value.push( {
            'fixationId': annotation.fixation!.id!,
            'boxId': annotation.characterBoundingBox!.id!
        } );
    } );
    // Load fixations
    const fix = sessionData.value.readingSession!.fixations!;

    fixations.value = [];
    fix.forEach( f => {
        if ( !fixIds.includes( f.id! ) ) {
            fixations.value.push( {
                'x': f.x!,
                'y': f.y!,
                'id': f.id!,
                'assigned': 'unassigned'
            } );
        }
    } );
    // Sorting
    fixations.value.sort( ( a, b ) => {
        return a.id! - b.id!;
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
};
