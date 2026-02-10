#!/usr/bin/env node
import {
    fileURLToPath
} from 'url';
import fs from 'fs-extra';
import path from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const inputSpec = path.resolve( __dirname, './openapi.json' );
const relDir = 'types/dtos/';
const outputDir = path.resolve( __dirname, './src/', relDir );

// Convert JSON Schema type to TypeScript type
function schemaTypeToTs ( propSchema ) {
    if ( propSchema.$ref ) return propSchema.$ref.replace( '#/components/schemas/', '' );

    if ( propSchema.type === 'integer' || propSchema.type === 'number' ) return 'number';

    if ( propSchema.type === 'string' ) return 'string';

    if ( propSchema.type === 'boolean' ) return 'boolean';

    if ( propSchema.type === 'array' ) {
        return propSchema.items ? `${ schemaTypeToTs( propSchema.items ) }[]` : 'any[]';
    }

    if ( propSchema.type === 'object' ) {
        if ( propSchema.properties ) {
            return '{ ' + Object.entries( propSchema.properties )
                .map( ( [
                    k,
                    v
                ] ) => `${ k }${ propSchema.required?.includes( k ) ? '' : '?' }: ${ schemaTypeToTs( v ) }` )
                .join( '; ' ) + ' }';
        }

        return 'Record<string, unknown>';
    }

    return 'any';
}

// Collect all referenced schemas in a schema recursively
function collectRefs ( schema ) {
    const refs = new Set();

    function recurse ( s ) {
        if ( !s ) return;

        if ( s.$ref ) refs.add( s.$ref.replace( '#/components/schemas/', '' ) );

        if ( s.type === 'array' && s.items ) recurse( s.items );

        if ( s.type === 'object' && s.properties ) {
            for ( const v of Object.values( s.properties ) ) recurse( v );
        }
    }

    recurse( schema );

    return Array.from( refs );
}

// Convert schema to TypeScript interface string, including imports
function schemaToInterface ( name, schema ) {
    const refs = collectRefs( schema )
        .filter( r => r !== name )
        .sort(); // avoid self-import and sort
    const importLines = refs
        .map( r => `import type { ${ r } } from "@/${ relDir }${ r }.ts";` )
        .join( '\n' );
    const lines = [ '{' ];

    if ( schema.type === 'object' && schema.properties ) {
        for ( const [
            propName,
            propSchema
        ] of Object.entries( schema.properties ) ) {
            const tsType = schemaTypeToTs( propSchema );

            lines.push( `  ${ propName }${ schema.required?.includes( propName ) ? '' : '?' }: ${ tsType };` );
        }
    }

    lines.push( '}' );

    return ( importLines ? importLines + '\n\n' : '' ) + `export interface ${ name } ${ lines.join( '\n' ) }`;
}

( async () => {
    try {
        const spec = await fs.readJson( inputSpec );

        if ( !spec.components || !spec.components.schemas ) {
            console.error( '❌ No components.schemas found in OpenAPI spec' );

            return;
        }

        await fs.emptyDir( outputDir );

        for ( const [
            name,
            schema
        ] of Object.entries( spec.components.schemas ) ) {
            const tsInterface = schemaToInterface( name, schema );

            await fs.writeFile( path.join( outputDir, `${ name }.d.ts` ), tsInterface + '\n', 'utf8' );
        }

        console.log( `✅ DTOs with type-only imports generated in ${ outputDir }` );
    } catch ( err ) {
        console.error( err );
        process.exit( 1 );
    }
} )();
