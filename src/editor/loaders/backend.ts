import {
    type Ref,
    ref
} from 'vue';
import {
    annotations,
    boundingBoxes,
    fixations
} from '../data';
import type {
    AnnotationSessionDto
} from '@/types/dtos/AnnotationSessionDto';
import type {
    Renderer
} from '../types/renderer';
import annotationManager from '@/ts/annotations';
import {
    useActiveFileStore
} from '@/ts/stores/activeFileStore';

export const sessionData: Ref<AnnotationSessionDto> = ref( {} );

export const loadEditorDataFromBackend = async ( renderer: Renderer ) => {
    const session = useActiveFileStore();

    sessionData.value = await annotationManager.getSessionById( session.sessionIds[ session.sessionIdx ]! );
    // Load image
    const img = sessionData.value.readingSession!.textDto!.backgroundImage!;

    renderer.textImage.src = img;

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
