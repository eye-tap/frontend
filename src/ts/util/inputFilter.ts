/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are numbers
 * @example @keydown="inputFilter.numeric()"
 * @returns A KeyboardEvent handler
 */
const numeric = () => {
    return regex( /[0-9]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are alphanumeric (i.e. numbers or letters)
 * @example @keydown="inputFilter.alphanumeric()"
 * @returns A KeyboardEvent handler
 */
const alphanumeric = () => {
    return regex( /[0-9a-zA-Z]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are lower or upper case letters
 * @example @keydown="inputFilter.alpha()"
 * @returns A KeyboardEvent handler
 */
const alpha = () => {
    return regex( /[a-zA-Z]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are lower case letters
 * @example @keydown="inputFilter.lowercase()"
 * @returns A KeyboardEvent handler
 */
const lowercase = () => {
    return regex( /[a-z]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are upper case letters
 * @example @keydown="inputFilter.uppercase()"
 * @returns A KeyboardEvent handler
 */
const uppercase = () => {
    return regex( /[A-Z]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function
 * Test if the entered characters are using allowed characters for typical passwords
 * @example @keydown="inputFilter.passwords()"
 * @returns A KeyboardEvent handler
 */
const passwords = () => {
    return regex( /[0-9a-zA-Z.,/?:_\-!%&()[]]/ );
};

/**
 * To use in a key handler, use @keydown in vue and call this function with a regex
 * Test if the entered characters pass the regex
 * @example @keydown="inputFilter.regex( /[0-9]/ )"
 * @returns A KeyboardEvent handler
 */
const regex = ( regex: RegExp ) => {
    return ( event: KeyboardEvent ) => {
        if ( regex.test( event.key ) ) {
            event.preventDefault();

            return false;
        }

        return true;
    };
};

export default {
    numeric,
    alphanumeric,
    alpha,
    lowercase,
    uppercase,
    passwords,
    regex
};
