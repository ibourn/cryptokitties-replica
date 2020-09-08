import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';

import { Genes } from '../../assets/modules/utils';

/************************************
 * 
 * Input range 
 * 
 * it uses callback from KittiesFactory to update adn code
 * 
 * ******************************** */
export default function InputRange(props) {
    const [value, setValue] = useState(props.dna[props.item]);

    useLayoutEffect(() => {
        if(value !== props.dna[props.item]){
            setValue(props.dna[props.item]);
        }
    }, [value, props.dna, props.item])

    /*get new value from user action*/
    const handleChange = (e) => {
        setValue(e.target.value);

        let newDna = { ...props.dna };
        newDna[props.item] = parseInt(e.target.value);
        props.handleChange(newDna);
    }

    const tagValue = Genes.convertValue(props.item, value);

    return (
        <Form>
            <FormGroup controlId="formBasicRange">
                <FormLabel>
                    <b>{props.text}</b>
                    <span className="badge badge-dark ml-2" id="headcode">
                        {tagValue}
                    </span>
                </FormLabel>
                <FormControl
                    type="range"
                    min={props.min}
                    max={props.max}
                    onChange={handleChange}
                    className="form-control-range"
                    value={value} />
            </FormGroup>
        </Form>
    );

}

InputRange.propTypes = {
    text: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    item: PropTypes.oneOf(["headColor", "mouthColor", "eyesColor", "earsColor",
    "eyesShape", "decorationPattern", "decorationMidcolor", 
    "decorationSidescolor", "animation", "lastNum"]),
    handleChange: PropTypes.func,
  };

