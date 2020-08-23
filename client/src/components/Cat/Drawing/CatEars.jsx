import React from 'react';
import PropTypes from 'prop-types';

import { allAnimations } from '../../../assets/modules/animations';

/*
set of available animations
*/
const animations = Object.values(allAnimations());

/************************************
 * 
 * Composition of ears' cat
 * 
 * ******************************** */
export default function CatEars(props) {
 //head animation
 const animId = animations[props.dna.animation];
 const earsVariation = animId.search('Ears') >=0 ? "animation-movingEars" : "";

 return (
    
        <div className={`ears ${earsVariation}`}>
        <div className="ear ear-left">
            <div className="ear-inside ear-inside_left">
            </div>
        </div>
        <div className="ear ear-right">
            <div className="ear-inside ear-inside_right">
            </div>
        </div>
    </div>
    )
}

CatEars.propTypes = {
    dna: PropTypes.object,
};