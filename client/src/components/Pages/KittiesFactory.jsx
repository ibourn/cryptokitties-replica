import React, { useState, useContext } from 'react';

import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Cat from '../Cat/Drawing/Cat';
import Dna from '../Cat/Dna/Dna';
import CatColors from '../Settings/CatColors';
import CatAttributes from '../Settings/CatAttributes';
import ConnectionBanner from '../Connection/ConnectionBanner';

import { Random } from '../../assets/modules/utils';

import '../../assets/css/factory.css';

//default dna values
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
    const [currentIsColor, setCurrentIsColor] = useState(true);
    const [dna, setDna] = useState(defaultDNA);

    // useEffect(() => {
    //     console.log(dna);
    //     if (dna === 0) {
    //         setDna(defaultDNA);
    //     }

    // }, [dna])


    /*
    update dna change from settings
    */
    const handleChange = (value) => {
        setDna(value);
    }
    /*
    clicks between color and cattribute panel
    */
    const handleClickColor = () => {
        setCurrentIsColor(true);
    }
    const handleClickCattributes = () => {
        setCurrentIsColor(false);
    }
    /*
    creation of kitty buttons
    */
    const handleClickRandomKitty = () => {
        setDna({
            "headColor": Random.inRange(10, 100),
            "mouthColor": Random.inRange(10, 100),
            "eyesColor": Random.inRange(10, 100),
            "earsColor": Random.inRange(10, 100),
            "eyesShape": Random.inRange(1, 7),
            "decorationPattern": Random.inRange(1, 9),
            "decorationMidcolor": Random.inRange(10, 100),
            "decorationSidescolor": Random.inRange(10, 100),
            "animation": Random.inRange(1, 7),
            "lastNum": Random.inRange(1, 10)
        });
    }
 
    const handleClickDefaultKitty = () => {
        setDna(defaultDNA);
    }

    return (
        <>
        <ConnectionBanner></ConnectionBanner>
            <div className="container p-5">

                <div align="center">
                    <h1 className="c-white">Kitties-Factory</h1>
                    <p className="c-white">Create your custom Kitty</p>
                </div>

                <div className="row">

                    <div className="col-lg-4 ">
                        <Row className="catBox m-2 light-b-shadow">
                            <div>
                                <Cat dna={dna}></Cat>
                            </div>
                            <br />
                            <div className="dnaDiv" id="catDNA">
                                <Dna dna={dna}></Dna>
                            </div>
                        </Row>

                        <Row>
                            <ButtonGroup bsPrefix='container' className="d-flex justify-content-around"
                                aria-label="Cat creation buttons">
                                <Button variant="primary" size="sm" className="rounded-pill"
                                    onClick={handleClickRandomKitty}>
                                    Get random kitty
                                 </Button>
                                <Button variant="primary" size="sm" className="rounded-pill"
                                    onClick={handleClickDefaultKitty}>
                                    Default kitty
                                 </Button>
                            </ButtonGroup>
                        </Row>
                    </div>

                    <div className="col-lg-7 cattributes m-2 light-b-shadow">
                        <Row style={{ marginBottom: '1em' }} >
                            <ButtonToolbar bsPrefix='container' className="d-flex justify-content-between" aria-label="Custom cat creation buttons">
                                <ButtonGroup aria-label="Toggle setting panels buttons">
                                    <Button variant="primary" size="sm"
                                        disabled={currentIsColor} onClick={handleClickColor}>
                                        Colors
                                    </Button>

                                    <Button variant="primary" size="sm" style={{ marginLeft: '0.2em' }}
                                        disabled={!currentIsColor} onClick={handleClickCattributes}>
                                        Cattributes
                                    </Button>
                                </ButtonGroup>

                                <ButtonGroup >
                                    <Button variant="primary" size="sm" className="rounded-pill">
                                        Create Kitty
                                     </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Row>
                        <div>
                            {(currentIsColor === true) ?
                                <CatColors dna={dna} handleChange={handleChange}> </CatColors>
                                :
                                <CatAttributes dna={dna} handleChange={handleChange}> </CatAttributes>
                            }
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


