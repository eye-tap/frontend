const checkEmail = ( email: string ) => {
    // eslint-disable-next-line no-useless-escape
    return ( /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ ).test( email );
};


export default {
    checkEmail
};
