import React from 'react';
import PropTypes from 'prop-types';

import CatEars from './CatEars';
import CatHair from './CatHair';
import CatFurHead from './CatFurHead';
import CatFace from './CatFace';
/************************************
 * 
 * Composition of head's cat
 * 
 * ******************************** */
export default function CatHead(props) {


    return (
        <>
            <CatEars dna={props.dna}></CatEars>

            <CatHair></CatHair>
            <CatFurHead></CatFurHead>

            <CatFace dna={props.dna}></CatFace>
            <div className="mustache mustache-left"></div>
            <div className="mustache mustache-right"></div>
        </>
    )
}

CatHead.propTypes = {
    dna: PropTypes.object,
};