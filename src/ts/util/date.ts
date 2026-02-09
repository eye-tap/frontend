const zeroFill = ( count: number ): string => {
    return `${ count < 10 && count >= 0 ? '0' : '' }${ count }`;
};

const formatDate = ( date: Date ) => {
    return `${ zeroFill( date.getDay() ) }.${ zeroFill( date.getMonth() ) }.${ zeroFill( date.getFullYear() ) }`;
};

const formatTime = ( date: Date ) => {
    return `${ zeroFill( date.getHours() ) }:${ zeroFill( date.getMinutes() ) }`;
};


const formatDateTime = ( date: Date ) => {
    return `${ formatDate( date ) }, ${ formatTime( date ) }`;
};


export {
    formatDate,
    formatTime,
    formatDateTime
};
