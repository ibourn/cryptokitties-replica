import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';

/************************************
 * 
 * Kitties Factory Page
 * 
 * ******************************** */

export default function InputRange(props) {
    const [value, setValue] = useState(props.dna[props.item]);

    const handleChange = (e) => {
        setValue(e.target.value);

        let newDna = { ...props.dna };
        newDna[props.item] = parseInt(e.target.value);
        props.handleChange(newDna);
    }

    return (
        <Form>
            <FormGroup controlId="formBasicRange">
                <FormLabel>
                    <b>{props.text}</b>
                    <span class="badge badge-dark ml-2" id="headcode">
                        {value}
                    </span>
                </FormLabel>
                <FormControl
                    type="range"
                    min={props.min}
                    max={props.max}
                    onChange={handleChange}
                    class="form-control-range"
                    value={value} />
            </FormGroup>
        </Form>
    );

}

