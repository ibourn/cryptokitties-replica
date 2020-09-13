import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputRange from './InputRange';


/************************************
 * 
 * Color settings
 * 
 * ******************************** */
export default function CatAttributes(props) {

    return (
        <>
            <InputRange text="Eyes shape" min="1" max="9" item='eyesShape'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text="Decoration Pattern" min="1" max="9" item='decorationPattern'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>

            <span style={{ fontWeight: 'bold' }}>
                Decoration color pattern:
             </span>
            <Row noGutters style={{ marginTop: '0.7em' }}>
                <Col lg={5}>
                    <InputRange text="Main color" min="10" max="98" item='decorationMidcolor'
                        loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
                    </InputRange>
                </Col>
                <Col lg={2}></Col>
                <Col lg={5}>
                    <InputRange text="Sides color" min="10" max="98" item='decorationSidescolor'
                        loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
                    </InputRange>
                </Col>
            </Row>

            <InputRange text="Animation" min="1" max="9" item='animation'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
            <InputRange text=" ? " min="1" max="9" item='lastNum'
                loadNewDna={props.loadNewDna} dna={props.dna} handleChange={props.handleChange}>
            </InputRange>
        </>
    );
}

CatAttributes.propTypes = {
    dna: PropTypes.object,
    handleChange: PropTypes.func,
};