import React, { useState, useEffect } from 'react';

import Cat from '../Cat/Drawing/Cat';
import Dna from '../Cat/Dna/Dna';
import CatColors from '../Settings/CatColors';

import { allColors } from '../../assets/modules/colors';

import '../../assets/css/factory.css';


const colors = Object.values(allColors());

var defaultDNA = {
    "headColor": 10,
    "mouthColor": 13,
    "eyesColor": 96,
    "earsColor": 10,
    //Cattributes
    "eyesShape": 1,
    "decorationPattern": 1,
    "decorationMidcolor": 13,
    "decorationSidescolor": 13,
    "animation": 1,
    "lastNum": 1
}
/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */

export default function KittiesFactory(props) {
    const [dna, setDna] = useState(defaultDNA);

    useEffect(() => {
        console.log(dna);
        if (dna === 0) {
            setDna(defaultDNA);
        }
    }, [dna])


    const handleChange = (value) => {
        setDna(value);
    }

    const contianerStyle = {
        marginTop: '12vh',
        marginBottom: '10vh'
    }
    const fontSizeStyle = {
        fontSize: '5px'
    }
    return (
        <>
            <div class="container p-5" style={contianerStyle}>

                <div align="center">
                    <h1 class="c-white">Kitties-Factory</h1>
                    <p class="c-white">Create your custom Kitty</p>
                </div>

                <div class="row">

                    <div class="col-lg-4 catBox m-2 light-b-shadow">

                        <div>
                            <Cat dna={dna}></Cat>
                        </div>
                        <br />

                        <div class="dnaDiv" id="catDNA">
                            <Dna dna={dna}></Dna>
                        </div>
                    </div>

                    <div class="col-lg-7 cattributes m-2 light-b-shadow">
                        {/* <!-- Cat colors --> */}
                        <div id="catColors">
                            <CatColors dna={dna}  handleChange={handleChange}> </CatColors>
                        </div>

                        <div>
                        </div>
                    </div>
                </div>
                <br />
            </div>

            <footer align="left">
                <p>Ivan on Tech Academy Bootcamp July 2020</p>
            </footer>
        </>

    );

}


