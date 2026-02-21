import {
    type Ref,
    ref,
    watch
} from 'vue';

// TODO: Add more themes
const themes: Ref<string[]> = ref( [
    'Blue',
    'Red',
    'Black',
    'Purple'
] );
const selectedTheme = ref( themes.value[ 0 ]! );

watch( selectedTheme, ( val, oldVal ) => {
    if ( val !== oldVal ) {
        document.documentElement.classList.remove( 'theme-' + oldVal.toLowerCase() );
        document.documentElement.classList.add( 'theme-' + val.toLowerCase() );
        document.dispatchEvent( new CustomEvent( 'eyetap:theme' ) );
        localStorage.setItem( 'theme', val );
    }
} );

const tempTheme = localStorage.getItem( 'theme' );

if ( tempTheme ) {
    if ( !themes.value.includes( tempTheme ) ) {
        localStorage.setItem( 'theme', selectedTheme.value );
        document.documentElement.classList.add( 'theme-' + themes.value[ 0 ]!.toLowerCase() );
    } else {
        selectedTheme.value = localStorage.getItem( 'theme' )!;
        document.documentElement.classList.add( 'theme-' + selectedTheme.value.toLowerCase() );
    }
} else {
    document.documentElement.classList.add( 'theme-' + themes.value[ 0 ]!.toLowerCase() );
}

document.documentElement.classList.add( 'init-complete' );

export {
    themes,
    selectedTheme
};
