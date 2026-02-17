import {
    type Ref, ref
} from 'vue';

// ┌                                               ┐
// │         Bounding boxes import config          │
// └                                               ┘
export const importConfigBBXminCoordCSVName: Ref<string> = ref( 'bbox_x1' );

export const importConfigBBXmaxCoordCSVName: Ref<string> = ref( 'bbox_x2' );

export const importConfigBBYminCoordCSVName: Ref<string> = ref( 'bbox_y1' );

export const importConfigBBYmaxCoordCSVName: Ref<string> = ref( 'bbox_y2' );

export const importConfigBBCharacterCSVName: Ref<string> = ref( 'character' );

export const importConfigBBTextIDCSVName: Ref<string> = ref( 'text_id' );

export const importConfigBBHasMultipleTexts: Ref<boolean> = ref( true );


// ┌                                               ┐
// │            Fixations import config            │
// └                                               ┘
export const importConfigFixationXCoordCSVName: Ref<string> = ref( 'x' );

export const importConfigFixationYCoordCSVName: Ref<string> = ref( 'y' );

export const importConfigFixationReaderCSVName: Ref<string> = ref( 'reader' );

export const importConfigFixationTextIDCSVName: Ref<string> = ref( 'text' );

export const importConfigFixationFixationIDCSVName: Ref<string> = ref( 'fixid' );

export const importConfigFixationHasMultipleTexts: Ref<boolean> = ref( true );


// ┌                                               ┐
// │           Annotations import config           │
// └                                               ┘
export const importConfigAnnotationReaderCSVName: Ref<string> = ref( 'reader' );

export const importConfigAnnotationTextIDCSVName: Ref<string> = ref( 'text' );

export const importConfigAnnotationFixationIDCSVName: Ref<string> = ref( 'fixid' );

export const importConfigAnnotationBoundingBoxIdCSVName: Ref<string> = ref( 'y' );

export const importConfigAnnotationHasMultipleTexts: Ref<boolean> = ref( true );
