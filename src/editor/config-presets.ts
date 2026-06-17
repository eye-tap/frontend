import {
    type Ref,
    ref
} from 'vue';
import {
    boxesDisplay,
    disableKeyHandler,
    enableZoom,
    fixationIndexDisplay,
    highlightSuggestedBox,
    linesDisplay,
    renderFixationHeatMapInsteadOfDefaultColour,
    renderScanPath,
    showExportButton
} from './config';

// If we want to change these, can use smart rename of the LS.
export type ConfigPreset = 'basic' | 'full' | 'nopreannotations';

export const configPreset: Ref<ConfigPreset> = ref( 'full' );

export const showPreAnnotations: Ref<boolean> = ref( false );

// TODO: Update this
export const availableTime: Ref<number> = ref( 300 );

export const setConfigPreset = ( preset: ConfigPreset | undefined ) => {
    if ( !preset ) return;

    if ( preset === 'basic' ) {
        disableKeyHandler.value = true;
        showExportButton.value = false;
        enableZoom.value = false;
        boxesDisplay.value = 'always';
        highlightSuggestedBox.value = false;
        renderFixationHeatMapInsteadOfDefaultColour.value = false;
        fixationIndexDisplay.value = 'none';
        renderScanPath.value = false;
        linesDisplay.value = 'previous';
        showPreAnnotations.value = false;
    } else if ( preset === 'full' ) {
        showPreAnnotations.value = true;
    }

    configPreset.value = preset;
};
