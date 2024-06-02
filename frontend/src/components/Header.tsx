import React from 'react';
import { Button } from 'react-bootstrap';
import Preloader from './Preloader';
import SubHeader from './SubHeader';

export default function Header() {
    return <>
<SubHeader/>

      <Preloader/>
        </>;
}
