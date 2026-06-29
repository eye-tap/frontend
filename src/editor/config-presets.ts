import {
    type OptionKey,
    type SectionKey,
    makeVisibility
} from './config-options';
import {
    type Ref,
    computed,
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
import {
    start
} from '@/ts/util/timer';



// If we want to change these, can use smart rename of the LS.
export type ConfigPreset = 'basic' | 'full' | 'nopreannotations' | 'unrestricted';

export const configPreset: Ref<ConfigPreset> = ref( 'full' );

export const showPreAnnotations: Ref<boolean> = ref( false );

export const availableTime: Ref<number> = ref( 300 );

export const endSurveyLink: Ref<string> = ref( 'https://survey.eyetap.ivia.ch/index.php/999838' );

export const fullSideBarAvailable: Ref<boolean> = ref( false );

const PRESET_VISIBLE_OPTIONS: Partial<Record<ConfigPreset, readonly ( OptionKey | SectionKey )[]>> = {
    'basic': [
        'colours',
        'boxStroke',
        'pointRadius'
    ]
};
const visibility = computed( () => makeVisibility( PRESET_VISIBLE_OPTIONS[ configPreset.value ] ) );

export const isOptionVisible = ( key: OptionKey | SectionKey ) => visibility.value.isOptionVisible( key );

export const isSectionVisible = ( key: SectionKey ) => visibility.value.isSectionVisible( key );

export const setConfigPreset = ( preset: ConfigPreset | undefined, timeToLogout?: number, endSurvey?: string ) => {
    availableTime.value = timeToLogout ? timeToLogout : -1;
    endSurveyLink.value = endSurvey ?? 'https://survey.eyetap.ivia.ch/index.php/999838';

    start();

    if ( !preset ) {
        console.warn( '[EDITOR] No config preset found for user, falling back to full' );
        showPreAnnotations.value = true;

        return;
    }

    if ( preset === 'basic' ) {
        disableKeyHandler.value = true;
        showExportButton.value = false;
        enableZoom.value = false;
        boxesDisplay.value = 'hovered'; // TODO: Consider if we want to use this setting
        highlightSuggestedBox.value = false;
        renderFixationHeatMapInsteadOfDefaultColour.value = false;
        fixationIndexDisplay.value = 'surrounding';
        renderScanPath.value = false;
        linesDisplay.value = 'previous';
        showPreAnnotations.value = false;
    } else if ( preset === 'full' ) {
        showPreAnnotations.value = true;
    } else if ( preset === 'nopreannotations' ) {
        showPreAnnotations.value = false;
    } else if ( preset === 'unrestricted' ) {
        showPreAnnotations.value = true;
        fullSideBarAvailable.value = true;
    }

    console.debug( '[EDITOR] Loading preset', preset );

    configPreset.value = preset;
};
