import React from 'react';
import PropTypes from 'prop-types';

import CatHead from './CatHead';
import CatBody from './CatBody';
import { StyledCat } from '../../../assets/sc/StyledCat';

/************************************
 * 
 * Composition of a cat
 * 
 * props size :
 *  - if define : size of cat is fixed
 *  - if undefined (kitties factory) : size of cat is responsive
 * 
 * ******************************** */
export default function Cat(props) {

    //specify a coef to size the cat (later: use mediaQuery)
    // const fontSize = props.size ? props.size : '6px';

    return (
            <StyledCat className="cat" size={props.size} dna={props.dna}>
                <CatHead dna={props.dna}></CatHead>

                <CatBody dna={props.dna}></CatBody>
            </StyledCat>
    );

}

Cat.propTypes = {
    dna: PropTypes.object,
};


