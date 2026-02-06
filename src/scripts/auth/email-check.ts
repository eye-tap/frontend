/*
 *                      oauth - email-check.ts
 *
 *    Created by Janis Hutz 08/22/2025, Licensed under the GPL V3 License
 *           https://janishutz.com, development@janishutz.com
 *
 *
*/

const checkEmail = ( email: string ) => {
    // eslint-disable-next-line no-useless-escape
    return ( /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ ).test( email );
};


export default {
    checkEmail
};
