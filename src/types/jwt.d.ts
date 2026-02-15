import type {
    UserRoles
} from './UserData';

export interface JWT {
    'id'?: number;
    'email'?: string;
    'username'?: string;
    'exp'?: number;
    'roles'?: UserRoles[];
}
