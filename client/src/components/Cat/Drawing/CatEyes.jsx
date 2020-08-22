import React from 'react';


/************************************
 * 
 * Composition of eyes
 * 
 * ******************************** */
export default function CatEyes(props) {

  
    return (
    
        <div className="eyes">
        <div className="eye">
            <div className="pupils"></div>
            <div className="glint glint-sup"></div>
            <div className="glint glint-inf"></div>
        </div>
        <div className="eye">
            <div className="pupils"></div>
            <div className="glint glint-sup"></div>
            <div className="glint glint-inf"></div>
        </div>
    </div>
    )
}