import React from 'react';
import PropTypes from 'prop-types';

import InputRange from './InputRange';

import { allEyeVariations } from '../../assets/modules/eyevariations';


/*
set of available colors
*/
const eyeVariations = Object.values(allEyeVariations());


/************************************
 * 
 * Color settings
 * 
 * ******************************** */
export default function CatAttributes(props) {

    return (
        <>
            <InputRange text="Eyes shape" min="1" max="7"
                item='eyesShape' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Decorative Pattern" min="1" max="7"
                item='decorationPattern' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Pattern color 1" min="10" max="98"
                item='decorationMidcolor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Pattern color 2" min="10" max="98"
                item='decorationSidescolor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Animation" min="1" max="7"
                item='animation' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text=" ? " min="1" max="7"
                item='lastNum' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
        </>
    );
}

CatAttributes.propTypes = {
    dna: PropTypes.object,
    handleChange: PropTypes.func,
  };