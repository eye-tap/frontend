type SidebarOption = {
    'text': string,
    'route': string,
    'id': number
};

type sidebarSection = {
    'name': string,
    'content': Array<SidebarOption>
};

export const adminBaseRoute = '/admin-new/';

/**
 * Populates the admin sidebar. IDs should be unique.
 */
export const adminContent: Array<sidebarSection> = [
    {
        'name': 'surveys',
        'content': [
            {
                'text': 'View Survey',
                'route': 'surveys',
                'id': 0
            },
            {
                'text': 'Create Survey',
                'route': 'create-survey',
                'id': 1
            }
        ]
    },
    {
        'name': 'texts',
        'content': [ {
            'text': 'View Texts',
            'route': 'texts',
            'id': 2
        } ]
    }
];