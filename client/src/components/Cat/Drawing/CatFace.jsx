import React from 'react';

import CatEyes from './CatEyes';

import { allPatternVariations } from '../../../assets/modules/patternvariations';

/*
set of available pattern variations
*/
const patternVariations = Object.values(allPatternVariations());

/************************************
 * 
 * Composition of face's cat
 * 
 * ******************************** */
export default function CatFace(props) {
    const variation = "patternVariation-" + patternVariations[props.dna.decorationPattern];


    return (

        <div className="face">
            <div id="midDot" class={`cat__head-dots ${variation}`}>
                <div id="leftDot" class={`cat__head-dots_first ${variation}`}></div>
                <div id="rightDot" class={`cat__head-dots_second ${variation}`}></div>
            </div>

            <div className="muzzle"></div>

            <CatEyes dna={props.dna}></CatEyes>
            <div className="truffle"></div>
            <div className="mouth"></div>
            <div className="tongue"></div>
            <div className="mustache mustache-left"></div>
            <div className="mustache mustache-right"></div>
        </div>
    )
}