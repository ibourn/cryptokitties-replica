import React from 'react';

import CatEyes from './CatEyes';
/************************************
 * 
 * Composition of face's cat
 * 
 * ******************************** */
export default function CatFace(props) {


    return (

        <div className="face">
<div id="midDot" class="cat__head-dots">
                            <div id="leftDot" class="cat__head-dots_first"></div>
                            <div id="rightDot" class="cat__head-dots_second"></div>
                        </div>

            <div className="muzzle"></div>

            <CatEyes></CatEyes>
            <div className="truffle"></div>
            <div className="mouth"></div>
            <div className="tongue"></div>
            <div className="mustache mustache-left"></div>
            <div className="mustache mustache-right"></div>
        </div>
    )
}