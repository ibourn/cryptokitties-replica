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
                         <span id="dnashape"></span>
                         <span id="dnadecoration"></span>
                         <span id="dnadecorationMid"></span>
                         <span id="dnadecorationSides"></span>
                         <span id="dnadanimation"></span>
                         <span id="dnaspecial"></span>
                    </b>

    );

}

