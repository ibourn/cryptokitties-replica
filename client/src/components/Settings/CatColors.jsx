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
            <InputRange text="Head and body" min="10" max="99" item='headColor'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Mouth | Belly | Tail" min="10" max="99" item='mouthColor'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Eyes" min="10" max="99" item='eyesColor'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Ears | Pawns " min="10" max="99" item='earsColor'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
        </>
    );
}

CatColors.propTypes = {
    dna: PropTypes.object,
    handleChange: PropTypes.func,
};