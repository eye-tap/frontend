import {
    type Ref,
    computed
} from 'vue';
import type {
    Color
} from '../types/boxes';

export const editorColorToStringColor = ( col: Color ) => {
    return `rgb(${ col.r }, ${ col.g }, ${ col.b })`;
};

export const stringColorToEditorColor = ( col: string ): Color => {
    if ( col.includes( 'rgb' ) ) {
        const c = col
            .slice( col.indexOf( '(' ) + 1, col.indexOf( ')' ) )
            .split( ',' )
            .map( val => val.trim() );
        const val = {
            'r': parseInt( c[0]! ),
            'g': parseInt( c[1]! ),
            'b': parseInt( c[2]! )
        };

        return val;
    } else if ( col.includes( '#' ) ) {
        return {
            'r': hexToDec( col.slice( 1, 3 ) ),
            'g': hexToDec( col.slice( 3, 5 ) ),
            'b': hexToDec( col.slice( 5, 7 ) )
        };
    } else {
        throw new Error( 'Invalid color' );
    }
};

// Cheap abuse of arrays
const convNum = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
];

const hexToDec = ( val: string ): number => {
    let dec = 0;

    for ( let i = 0; i < val.length; i++ ) {
        dec += Math.pow( 16, val.length - i - 1 ) * convNum.indexOf( val[i]! );
    }

    return dec;
};

export const automatedColourMapper = ( color: Ref<Color> ) => {
    return computed( {
        get () {
            return editorColorToStringColor( color.value );
        },
        set ( val: string ) {
            color.value = stringColorToEditorColor( val );
        }
    } );
};
