/*
 *                      oauth - pw-rating.ts
 *
 *    Created by Janis Hutz 08/22/2025, Licensed under the GPL V3 License
 *           https://janishutz.com, development@janishutz.com
 *
 *
*/

import {
    type Options, owaspSymbols, passwordStrength
} from 'check-password-strength';


export enum PWStrength {
    'Unrated',
    'BelowReq',
    'Poor',
    'Weak',
    'Average',
    'Strong',
    'Excellent'
}

const opts: Options<PWStrength> = [
    {
        'id': 0,
        'value': PWStrength.BelowReq,
        'minDiversity': 0,
        'minLength': 0
    },
    {
        'id': 1,
        'value': PWStrength.Poor,
        'minDiversity': 1,
        'minLength': 6
    },
    {
        'id': 2,
        'value': PWStrength.Weak,
        'minDiversity': 2,
        'minLength': 8
    },
    {
        'id': 3,
        'value': PWStrength.Average,
        'minDiversity': 3,
        'minLength': 10
    },
    {
        'id': 4,
        'value': PWStrength.Strong,
        'minDiversity': 4,
        'minLength': 13
    },
    {
        'id': 5,
        'value': PWStrength.Excellent,
        'minDiversity': 4,
        'minLength': 20
    }
];

export interface PWStats {
    'upperCase': boolean;
    'lowerCase': boolean;
    'number': boolean;
    'special': boolean;
}

export interface PWRating {
    'value': PWStrength,
    'id': number,
    'length': number,
    'stats': PWStats
}

/**
 * @param pw - The password to check
 * @returns Details on the password
 */
const ratePW = ( pw: string ): PWRating => {
    const evaluation = passwordStrength( pw, opts, owaspSymbols );

    return {
        'value': evaluation.value,
        'id': evaluation.id,
        'length': evaluation.length,
        'stats': {
            'lowerCase': evaluation.contains.includes( 'lowercase' ),
            'upperCase': evaluation.contains.includes( 'uppercase' ),
            'number': evaluation.contains.includes( 'number' ),
            'special': evaluation.contains.includes( 'symbol' )
        }
    };
};

const getTranslation = ( strength: PWStrength ): string => {
    switch ( strength ) {
        case PWStrength.BelowReq:
            return 'Invalid';
        case PWStrength.Poor:
            return 'Poor';
        case PWStrength.Weak:
            return 'Weak';
        case PWStrength.Average:
            return 'Average';
        case PWStrength.Strong:
            return 'Strong';
        case PWStrength.Excellent:
            return 'Excellent';

        default:
            return '';
    }
};

export default {
    ratePW,
    getTranslation,
    opts
};
