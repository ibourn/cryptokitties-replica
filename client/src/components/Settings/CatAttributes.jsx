import React from 'react';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputRange from './InputRange';

import { allEyeVariations } from '../../assets/modules/eyevariations';


/*
set of available colors
*/
const eyeVariations = Object.values(allEyeVariations());


/************************************
 * 
 * Color settings
 * 
 * ******************************** */
export default function CatAttributes(props) {

    return (
        <>
            <InputRange text="Eyes shape" min="1" max="7"
                item='eyesShape' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Decoration Pattern" min="1" max="7"
                item='decorationPattern' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <span style={{ fontWeight: 'bold'}}>
                Decoration color pattern:
             </span>
            <Row noGutters style={{ marginTop: '0.7em' }}>
                <Col lg={5}>
                    <InputRange text="Main color" min="10" max="98"
                        item='decorationMidcolor' dna={props.dna} handleChange={props.handleChange}>
                    </InputRange>
                </Col>
                <Col lg={2}></Col>
                <Col lg={5}>
                    <InputRange text="Sides color" min="10" max="98"
                        item='decorationSidescolor' dna={props.dna} handleChange={props.handleChange}>
                    </InputRange>
                </Col>
            </Row>
            <InputRange text="Animation" min="1" max="7"
                item='animation' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text=" ? " min="1" max="7"
                item='lastNum' dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
        </>
    );
}

CatAttributes.propTypes = {
    dna: PropTypes.object,
    handleChange: PropTypes.func,
};