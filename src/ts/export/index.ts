const startExport = ( surveyId: number ) => {
    const a = document.createElement( 'a' );

    document.body.appendChild( a );
    a.style = 'display: none';
    a.href = localStorage.getItem( 'url' ) + '/export/' + surveyId;
    a.download = 'export.zip';
    a.click();
};

export {
    startExport
};
