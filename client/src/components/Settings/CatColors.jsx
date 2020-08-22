import React from 'react';
import PropTypes from 'prop-types';


import InputRange from './InputRange';

/************************************
 * 
 * Color settings
 * 
 * ******************************** */
export default function CatColors(props) {

    return (
        <>
            <InputRange text="Head and body" min="10" max="98"
                item='headColor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Mouth | Belly | Tail" min="10" max="98"
                item='mouthColor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Eyes" min="10" max="98"
                item='eyesColor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Ears | Pawns " min="10" max="98"
                item='earsColor' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
        </>
    );
}

CatColors.propTypes = {
    dna: PropTypes.object,
    handleChange: PropTypes.func,
  };