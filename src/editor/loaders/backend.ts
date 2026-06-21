import {
    type Ref,
    ref
} from 'vue';
import {
    algorithmsList,
    annotations,
    boundingBoxes,
    fixations,
    machineAnnotations,
    selectedFixation
} from '../data';
import {
    heatMapMaxValue,
    heatMapMidValue,
    heatMapMinValue
} from '../config';
import {
    setConfigPreset,
    showPreAnnotations
} from '../config-presets';
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

    // set config preset (for development mode)
    if ( import.meta.env.VITE_DEV_TOOLS ) {
        const otherData = JSON.parse( sessionData.value.furtherOptions ?? '{}' );

        setConfigPreset( otherData[ 'preset' ] );
    }

    // Load image
    const img = sessionData.value.readingSession!.textDto!.backgroundImage!;

    renderer.textImage.src = 'data:image/jpg;base64,' + img;

    // ┌                                               ┐
    // │                Load fixations                 │
    // └                                               ┘
    const fix = sessionData.value.readingSession!.fixations!;

    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;
    let avg = 0;

    fixations.value = [];
    fix.forEach( f => {
        const isInvalid = sessionData.value.removedFixations?.includes( f.id! ) ?? false;

        fixations.value.push( {
            'x': f.x!,
            'y': f.y!,
            'id': f.id!,
            'assigned': isInvalid ? 'invalid' : 'unassigned',
            'disagreement': f.disagreement
        } );

        if ( f.disagreement ) {
            if ( max < f.disagreement ) max = f.disagreement!;

            if ( min > f.disagreement ) min = f.disagreement!;

            avg += f.disagreement;
        }
    } );

    // Update heatmap bounds
    heatMapMaxValue.value = max;
    heatMapMinValue.value = min;
    heatMapMidValue.value = avg / fix.length;

    // ───────────────────────────────────────────────────────────────────
    // ┌                                               ┐
    // │              Load bounding boxes              │
    // └                                               ┘
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

    // ───────────────────────────────────────────────────────────────────
    // ┌                                               ┐
    // │               Load annotations                │
    // └                                               ┘
    const annotationLoad = sessionData.value.annotations!;

    annotations.value = [];
    userAnnotations.value = [];

    if ( annotationLoad )
        annotationLoad.forEach( annotation => {
            const ann: EditorAnnotation = {
                'fixationIdx': getFixIdxFromId( annotation.fixation!.id! ),
                'boxIdx': getBoxIdxFromId( annotation.characterBoundingBox!.id! )
            };

            if ( annotation.annotationType !== 'MACHINE_ANNOTATED' ) {
                fixations.value[ ann.fixationIdx ]!.assigned = 'assigned';
            } else {
                throw new Error( 'Machine annotation found in annotations' );
            }

            annotations.value.push( ann );
        } );

    // ┌                                               ┐
    // │           Load machine annotations            │
    // └                                               ┘
    const machineAnnotationsLoad = sessionData.value.machineAnnotations;

    if ( machineAnnotationsLoad && showPreAnnotations.value ) {
        algorithmsList.value = Object.keys( machineAnnotationsLoad );

        algorithmsList.value.forEach( algo => {
            const details = machineAnnotationsLoad[ algo ]! as AnnotationDto[];

            details.forEach( annotation => {
                if ( annotation.fixation && annotation.characterBoundingBox ) {
                    const ann: EditorAnnotation = {
                        'fixationIdx': getFixIdxFromId( annotation.fixation!.id! ),
                        'boxIdx': getBoxIdxFromId( annotation.characterBoundingBox!.id! ),
                        'algorithm': algo
                    };

                    if ( fixations.value[ ann.fixationIdx ]!.assigned === 'unassigned' ) {
                        fixations.value[ ann.fixationIdx ]!.assigned = 'machine';
                    }

                    machineAnnotations.value.push( ann );
                }
            } );
        } );
    }

    selectedFixation.value = 0;

    // If none found that is unassigned, annotation is soft complete
    if ( fixations.value[ 0 ]!.assigned === 'assigned' ) {
        for ( let i = 1; i < fixations.value.length; i++ ) {
            if ( fixations.value[ i ]!.assigned !== 'assigned' ) {
                selectedFixation.value = i;
                break;
            }
        }
    }

    // If you do not want to diplay the reader, delete it here
    const data = session.sessionIds[ session.sessionIdx ]!;

    let title = data.desc ?? 'EyeTAP';

    if ( fixations.value[ selectedFixation.value ]!.assigned === 'assigned' )
        title += ' (complete)';
    else if ( fixations.value[ selectedFixation.value ]!.assigned === 'machine' )
        title += ' (soft complete)';
    // TODO: Do we really want the soft complete?

    sendLoadEvent( title );
    renderer.renderAll();
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
