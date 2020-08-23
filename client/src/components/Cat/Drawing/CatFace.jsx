import React from 'react';
import PropTypes from 'prop-types';

import CatEyes from './CatEyes';

import { allPatternVariations } from '../../../assets/modules/patternvariations';
import { allAnimations } from '../../../assets/modules/animations';

/*
set of available pattern variations
*/
const patternVariations = Object.values(allPatternVariations());
/*
set of available animations
*/
const animations = Object.values(allAnimations());

/************************************
 * 
 * Composition of face's cat
 * 
 * ******************************** */
export default function CatFace(props) {
    const variation = "patternVariation-" + patternVariations[props.dna.decorationPattern];
    //head animation
    const animId = animations[props.dna.animation];
    const headVariation = animId.search('Head') >= 0 ? "animation-movingHead" : "";
    const truffleVariation = animId.search('Truffle') >= 0 ? "animation-movingTruffle" : "";

    return (
        //* <div className={` ${headVariation}`}> */}
        <div className={`face ${headVariation}`}>
            <div id="midDot" className={`cat__head-dots ${variation}`}>
                <div id="leftDot" className={`cat__head-dots_first ${variation}`}></div>
                <div id="rightDot" className={`cat__head-dots_second ${variation}`}></div>
            </div>

            <div className="muzzle"></div>

            <CatEyes dna={props.dna}></CatEyes>
            <div className={`truffle ${truffleVariation}`}></div>
            <div className="mouth"></div>
            <div className="tongue"></div>
        </div>
        // </div>
    )
}

CatFace.propTypes = {
    dna: PropTypes.object,
};