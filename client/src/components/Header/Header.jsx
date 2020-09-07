import React from 'react';

import MainNavBar from '../NavBars/MainNavBar';
import ConnectionBanner from '../Connection/ConnectionBanner';

/**
 * Main Header
 */
export default function Header() {


    return(
        <div className="sticky-top">
        <MainNavBar></MainNavBar>
        <ConnectionBanner></ConnectionBanner>
      </div>
    )
}