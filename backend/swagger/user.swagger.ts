import { deactivateUserAccountSwagger } from './user/deactivateUser.swagger';
import { deleteUserAccountSwagger } from './user/deleteUserAccount.swagger';
import { getAllUserAccountsSwagger } from './user/getAllUserAccounts.swagger';
import { profileSwagger } from './user/profile.swagger';

export const userSwagger = {
    ...profileSwagger,
    ...getAllUserAccountsSwagger,
    ...deleteUserAccountSwagger,
    ...deactivateUserAccountSwagger,
};
