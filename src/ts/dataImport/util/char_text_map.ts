export const createUidLookupMap = (csvText: string): Map<string, string> => {
    const lines = csvText.split( /\r?\n/ ).filter( l => l.trim() !== '' );
    const header = lines.shift()!.split( ',' )
        .map( h => h.trim() );
    
    const charUid = header.indexOf('text_uid'); //Target for characterid lookup
    const textUid = header.indexOf('text_id');   //global text ID

    const lookup = new Map<string, string>();

    lines.forEach(line => {
        const cols = line.split(',');
        if (cols[charUid] !== undefined && cols[textUid] !== undefined) {
            lookup.set(cols[charUid].trim(), cols[textUid].trim());
        }
    });

    return lookup;
};