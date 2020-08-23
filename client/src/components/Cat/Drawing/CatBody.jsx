import React from 'react';
import PropTypes from 'prop-types';

import { allAnimations } from '../../../assets/modules/animations';


/*
set of available animations
*/
const animations = Object.values(allAnimations());

/************************************
 * 
 * Composition of body's cat
 * 
 * ******************************** */
export default function CatBody(props) {

    //head animation
 const animId = animations[props.dna.animation];
 const tailVariation = animId.search('Tail') >=0 ? "animation-movingTail" : "";
 
    return (
    
        <div className="body">
        <div className={`tail ${tailVariation}`}></div>
        <div className="front">
            <div className="belly"></div>
        </div>
        <div className="rear"></div>
    
        <div className="pawn pawn-rear_left">
            <div className="calw"></div>
        </div>
        <div className="pawn pawn-rear_right">
            <div className="calw"></div>
        </div>
    
        <div className="pawn pawn-front_left">
            <div className="claw"></div>
        </div>
    
    
        <div className="pawn pawn-front_right">
            <div className="claw"></div>
        </div>

        <div className="limb-front limb-left">
            <div className="limb-bottom"></div>
        </div>
        <div className="limb-front limb-right">
        <div className="limb-bottom"></div>
        </div>
    </div>
    )
}

CatBody.propTypes = {
    dna: PropTypes.object,
};