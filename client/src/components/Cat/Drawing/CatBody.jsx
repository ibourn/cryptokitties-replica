import React from 'react';


/************************************
 * 
 * Composition of body's cat
 * 
 * ******************************** */
export default function CatBody(props) {

 
    return (
    
        <div className="body">
        <div className="tail"></div>
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