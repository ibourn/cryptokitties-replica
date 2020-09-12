import React, { useState, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';



/**
 * Manages events binded to a transaction
 * 
 * - display alert information 
 * - 2 states : succes /error
 * 
 * @param {any} props 
 */
export default function EventManager(props) {
    const [data, setData] = useState();
    const [show, setShow] = useState({
        status: false,
        type: "",
        data: ""
    });


    /**
     * handles result of the event 
     * 
     * - as they're no unsubcription, handles it by testing  type === ""
     * - if the event result is needed callback exists
     */
    const handleEvent = useCallback(function (error, event) {
        let type = show.type;
        let data = show.data;

        if (show.type === "") {
            if (error) {
                type = "danger";
                data = error;
            } else {
                type = "success";
                data = event.returnValues;
                /*the event was initiated to forward its result*/
                // if (props.data.callback) {
                    props.forwardCelebration({
                        id: data.kittenId,
                        mumId: data.mumId,
                        dadId: data.dadId,
                        genes: data.genes,
                        birthTime: data.birthTime,
                        generation: data.generation,
                        owner: data.owner
                    });
                // }
            }
        }
        setShow({
            status: true,
            type: type,
            data: data
        })
    }, [show.type, show.data, props]);


    /**
     * handles the closure of the alert
     */
    const handleOnClose = () => {
        setShow({
            show: false,
            type: "",
            data: null
        })
    }

    /**
     * initializes a new event listener
     * 
     * @todo try subscriptionID to unsubscribe, at the moment it doesn't work :
     * .on('connected', function(id){subscriptionId = id;});
     * then subscriptionId.unsubscribe();
     */
    const initSubscription = useCallback(async function () {
        setData(props.data);

        switch (props.data.name) {
            case 'Birth':
                props.data.instance.events.Birth(handleEvent)
                break;
            default:
                break;
        }

        setShow({
            status: true,
            type: "",
            msg: "event initalized"
        });
    }, [props.data, handleEvent]);


    /**
     * get the content to display following the result of the event
     * 
     * - error disabled cause already processed by txmanager (without info)
     */
    const getContent = () => {
        let content = "";

        if (show.type === 'success') {
            switch (props.data.name) {
                case 'Birth':
                    content = <>
                        <p>
                            <b>{`Your new kitten from generation ${show.data.generation} is born!`}</b> <i>Its information :</i>
                        </p>
                        <hr />
                        <p>
                            <b> {`Id : ${show.data.kittenId}`}</b>
                            {` - mum Id : ${show.data.mumId} - dad Id : ${show.data.dadId} 
                            - genes : ${show.data.genes} - owner : ${show.data.owner}`}
                        </p>
                    </>;
                    break;
                default:
                    break;
            }
        }
        else if (show.type === 'danger') {
            content = <>
                <p>
                    <b> {`${show.name} - Transaction failed, an error occured`}</b>
                    {` - code : ${show.data.code}`}
                </p>
                <hr />
                <p>
                    {`message : ${show.data.message}`}
                </p>
            </>;
        }
        return content;
    }


    useLayoutEffect(() => {
        if (!data) {//(data !== props.data) {
            initSubscription();
        }
    }, [props.data, data, initSubscription]);


    return (
        <>
            {
                show.status && (show.type === 'success') ?
                    <Alert variant={show.type} onClose={handleOnClose}
                        dismissible style={{ fontSize: '0.8em' }}>
                        {getContent()}
                    </Alert>
                    : null
            }
        </>
    );
}


EventManager.propTypes = {
    data: PropTypes.object,
    close: PropTypes.func
};