import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';

export const PersonalAccount = () => {
    return (
        <>
            <Breadcrumbs />
            <NavMenu />
            PersonalAccount
        </>
    );
};
