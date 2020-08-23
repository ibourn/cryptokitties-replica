import React from 'react';
import PropTypes from 'prop-types';

import { allEyeVariations } from '../../../assets/modules/eyevariations';


/*
set of available eyes variations
*/
const eyeVariations = Object.values(allEyeVariations());


/************************************
 * 
 * Composition of eyes
 * 
 * ******************************** */
export default function CatEyes(props) {
    const variation = "eyeVariation-" + eyeVariations[props.dna.eyesShape];

    return (

        <div className={`eyes ${variation}`}>
            <div className={`eye ${variation}`}>
                <div className={`pupils ${variation}`}></div>
                <div className={`glint glint-sup ${variation}`}></div>
                <div className={`glint glint-inf ${variation}`}></div>
            </div>
            <div className={`eye ${variation}`}>
                <div className={`pupils ${variation}`}></div>
                <div className={`glint glint-sup ${variation}`}></div>
                <div className={`glint glint-inf ${variation}`}></div>
            </div>
        </div>
    )
}

CatEyes.propTypes = {
    dna: PropTypes.object,
};