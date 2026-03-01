import {
    fileLoaderString,
    loadAllFilesOfElementAsStringWithCallback
} from '../../util/fileLoader';
import type {
    ImportCharacterBoundingBoxDto
} from '@/types/dtos/ImportCharacterBoundingBoxDto';
import type {
    ImportConfig
} from '@/types/import';
import {
    MissingFilesError
} from '../../util/errors';
import {
    boundingBoxesOpts
} from './util';
import {
    createUidLookupMap
} from '../../util/char_text_map';
import {
    determineCorrectParserSettings
} from '../../util/parserSettingsGenerator';

export const uidBasedCharacterBoundingBoxImporter: ImportConfig<ImportCharacterBoundingBoxDto[]> = {
    'display': 'Text UID based Bounding Box Creation ',
    'options': {
        ...boundingBoxesOpts,
        'textuid': {
            'display': 'Text UID',
            'value': 'text_uid',
            'input': 'string',
            'searchTerms': [
                'text_uid',
                'textuid'
            ]
        },
        'association': {
            'display': 'Text to generate associations from', // TODO: Update name, this is for texts.csv file
            'value': null,
            'input': 'file'
        },
        'assTextUID': {
            'display': 'Text UID', // TODO: Update name, this is for texts.csv file
            'value': 'text_uid',
            'input': 'string'
        },
        'assTextID': {
            'display': 'Text ID', // TODO: Update name, this is for texts.csv file
            'value': 'text_id',
            'input': 'string'
        }
    },
    'parse': async ( inputElement: HTMLInputElement, _textId: string, lang: string ): Promise<ImportCharacterBoundingBoxDto[]> => {
        if ( !inputElement.files || !inputElement.files[0] ) throw new MissingFilesError();

        const assocFile = uidBasedCharacterBoundingBoxImporter.options.association?.value as File | null;
        const uidCol = uidBasedCharacterBoundingBoxImporter.options.assTextUID?.value as string | undefined;
        const idCol = uidBasedCharacterBoundingBoxImporter.options.assTextID?.value as string | undefined;

        if ( !assocFile || !uidCol || !idCol ) {
            throw new MissingFilesError();
        }

        // build lookup from textuid -> textid
        const textUidLookup = createUidLookupMap(
            await fileLoaderString( assocFile ),
            uidCol,
            idCol
        );
        const boundingBoxStore: ImportCharacterBoundingBoxDto[] = [];

        await loadAllFilesOfElementAsStringWithCallback( inputElement, async ( data: string ) => {
            const lines = data.split( /\r?\n/ ).filter( l => l.trim() !== '' );
            const header = lines.shift()!.split( ',' ).map( h => h.trim() );
            const textUidIndex = header.indexOf( uidBasedCharacterBoundingBoxImporter.options.textuid!.value as string );
            const charIndex = header.indexOf( boundingBoxesOpts.char!.value as string );
            const xMinIndex = header.indexOf( boundingBoxesOpts.xMin!.value as string );
            const xMaxIndex = header.indexOf( boundingBoxesOpts.xMax!.value as string );
            const yMinIndex = header.indexOf( boundingBoxesOpts.yMin!.value as string );
            const yMaxIndex = header.indexOf( boundingBoxesOpts.yMax!.value as string );
            const langIndex = header.indexOf( boundingBoxesOpts.lang!.value as string );

            if ( textUidIndex < 0 )
                throw new Error( 'text UID column not found' );

            if ( charIndex < 0 )
                throw new Error( 'character column not found' );

            if ( xMinIndex < 0 || xMaxIndex < 0 || yMinIndex < 0 || yMaxIndex < 0 )
                throw new Error( 'bounding box coordinate columns not found' );

            lines.forEach( line => {
                const cols = line.split( ',' );

                if ( lang === 'undefined' || ( langIndex > -1 ? cols[langIndex]! === lang : true ) ) {
                    const uid = cols[textUidIndex]!;
                    const mappedId = textUidLookup.get( uid );

                    if ( mappedId ) {
                        const x1 = Number( cols[xMinIndex] );
                        const x2 = Number( cols[xMaxIndex] );
                        const y1 = Number( cols[yMinIndex] );
                        const y2 = Number( cols[yMaxIndex] );

                        boundingBoxStore.push( {
                            'foreignId': Number( mappedId ),
                            'character': String( cols[charIndex] ),
                            'xMin': x1 < x2 ? x1 : x2,
                            'xMax': x1 < x2 ? x2 : x1,
                            'yMin': y1 < y2 ? y1 : y2,
                            'yMax': y1 < y2 ? y2 : y1
                        } );
                    }
                }
            } );
        } );

        return boundingBoxStore;
    },
    'canParse': ( header: string[] ) => {
        return determineCorrectParserSettings( header, uidBasedCharacterBoundingBoxImporter );
    }
};
