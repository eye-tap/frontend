import type {
    ProgressDto
} from '@/types/dtos/ProgressDto';
import type {
    ReadingSessionProgressDto
} from '@/types/dtos/ReadingSessionProgressDto';
import {
    backend
} from '../util/url';

export interface SessionProgress {
    'averageAnnPerFix': number;
    'annotators': number;
    'text': string;
    'sortDescriptor': number;
    'reader': number;
}

export interface StatsElement {
    'display': string;
    'value': number;
    'prefix'?: string;
}

export const getStats = async (): Promise<ProgressDto> => {
    const res = await fetch( backend.url + '/progress' );

    return await res.json();
};

export const preprocessProgress = ( data: Record<string, ReadingSessionProgressDto> ) => {
    const progressList: SessionProgress[] = [];
    const texts: {
        [key: string]: number
    } = {};

    for ( const key in data ) {
        const el = {
            ...data[key]!
        };
        const textDto = key.substring( key.indexOf( 'ShallowTextDto' ) + 18 );
        const reader = parseInt( key.slice( key.indexOf( 'readerId' ) + 9, key.indexOf( ',' ) ) );
        const text = textDto.slice( textDto.indexOf( 'title' ) + 6, textDto.indexOf( ']' ) );
        const textId = parseInt( textDto.slice( 0, textDto.indexOf( ',' ) ) );

        progressList.push( {
            'averageAnnPerFix': el.averageAnnotationsPerFixation ?? 0,
            'annotators': el.numberOfUniqueAnnotators ?? 0,
            'text': text,
            'sortDescriptor': ( textId * 10000 ) + reader,
            'reader': reader
        } );
        texts[ text ] = textId;
    }

    const textList = Object.keys( texts )
        .map( val => {
            return {
                'text': val,
                'sort': texts[ val ]!
            };
        } )
        .sort( ( a, b ) => a.sort - b.sort )
        .map( val => val.text );

    return {
        'progress': progressList
            .sort( ( a, b ) => a.sortDescriptor - b.sortDescriptor ),
        'textList': textList,
        'firstText': textList[0]!
    };
};
