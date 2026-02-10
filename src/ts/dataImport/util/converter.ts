/**
 * Convert bytes (Uint8Array) to base64 string
 * @param data - The Array
 * @returns The base64 string
 */
export const uint8ArrayToBase64 = ( data: Uint8Array<ArrayBuffer> ) => {
    return btoa( String.fromCharCode( ...data ) );
};

/**
 * Convert an ArrayBuffer into a base64 string
 * @param data - The ArrayBuffer
 * @returns The base64 string
 */
export const ArrayBufferToBase64 = ( data: ArrayBuffer ) => {
    return new Uint8Array( data );
};
