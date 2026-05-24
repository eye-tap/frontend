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
export type ConfigPreset = 'basic' | 'full';

export const configPreset: Ref<ConfigPreset> = ref( 'full' );

export const setConfigPreset = ( preset: ConfigPreset | undefined ) => {
    if ( !preset ) return;

    if ( preset == 'basic' ) {
        disableKeyHandler.value = true;
        showExportButton.value = false;
        enableZoom.value = false;
        boxesDisplay.value = 'always';
        highlightSuggestedBox.value = false;
        renderFixationHeatMapInsteadOfDefaultColour.value = false;
        fixationIndexDisplay.value = 'none';
        renderScanPath.value = false;
        linesDisplay.value = 'previous';
    }
    // TODO: Here we can configure config options for other presets

    configPreset.value = preset;
};
