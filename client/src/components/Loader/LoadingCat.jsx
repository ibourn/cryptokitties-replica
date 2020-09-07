import React from 'react';

import { AnimatedCat } from '../../assets/sc/AnimatedCat';

/**
 * loading animation 
 */
export default function LoadingCat() {

    return (
        <AnimatedCat className="cat">
            <div className="ear ear--left"></div>
            <div className="ear ear--right"></div>
            <div className="face">
                <div className="eye eye--left">
                    <div className="eye-pupil"></div>
                </div>
                <div className="eye eye--right">
                    <div className="eye-pupil"></div>
                </div>
                <div className="muzzle"></div>
            </div>
            <span> Cats have heard your request... they’re just deciding whether they’re coming or not...</span>

        </AnimatedCat>
    );
}