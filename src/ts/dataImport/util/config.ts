import {
    type Ref, ref
} from 'vue';

export const importConfigBBXminCoordCSVName: Ref<string> = ref( 'bbox_x1' );

export const importConfigBBXmaxCoordCSVName: Ref<string> = ref( 'bbox_x2' );

export const importConfigBBYminCoordCSVName: Ref<string> = ref( 'bbox_y1' );

export const importConfigBBYmaxCoordCSVName: Ref<string> = ref( 'bbox_y2' );

export const importConfigBBCharacterCSVName: Ref<string> = ref( 'character' );

export const importConfigBBTextIDCSVName: Ref<string> = ref( 'text_id' );

export const importConfigBBHasMultipleTexts: Ref<boolean> = ref( true );

export const importConfigFixationXCoordCSVName: Ref<string> = ref( 'x' );

export const importConfigFixationYCoordCSVName: Ref<string> = ref( 'y' );

export const importConfigFixationReaderCSVName: Ref<string> = ref( 'reader' );

export const importConfigFixationTextIDCSVName: Ref<string> = ref( 'text' );

export const importConfigFixationHasMultipleTexts: Ref<boolean> = ref( true );
