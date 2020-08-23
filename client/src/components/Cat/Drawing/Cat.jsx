import React from 'react';
import PropTypes from 'prop-types';

import CatHead from './CatHead';
import CatBody from './CatBody';
import { StyledCat } from '../../../assets/sc/StyledCat';

/************************************
 * 
 * Composition of a cat
 * 
 * ******************************** */
export default function Cat(props) {

    //specify a coef to size the cat (later: use mediaQuery)
    const fontSize = '6px';

    return (
            <StyledCat className="cat" size={fontSize} dna={props.dna}>
                <CatHead dna={props.dna}></CatHead>

                <CatBody dna={props.dna}></CatBody>
            </StyledCat>
    );

}

Cat.propTypes = {
    dna: PropTypes.object,
};


