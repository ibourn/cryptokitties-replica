import React from 'react';


/************************************
 * 
 * Composition of adn code
 * 
 * ******************************** */
export default function Dna(props) {

    return (
               <b>
                        DNA:
                        {/* <!-- Colors --> */}
                         <span id="dnabody">{props.dna.headColor}</span>
                         <span id="dnamouth">{props.dna.mouthColor}</span>
                         <span id="dnaeyes">{props.dna.eyesColor}</span>
                         <span id="dnaears">{props.dna.earsColor}</span>
                        
                         {/* <!-- Cattributes --> */}
                         <span id="dnashape">{props.dna.eyesShape}</span>
                         <span id="dnadecoration">{props.dna.decorationPattern}</span>
                         <span id="dnadecorationMid">{props.dna.decorationMidcolor}</span>
                         <span id="dnadecorationSides">{props.dna.decorationSidescolor}</span>
                         <span id="dnadanimation">{props.dna.animation}</span>
                         <span id="dnaspecial">{props.dna.lastNum}</span>
                    </b>

    );

}

