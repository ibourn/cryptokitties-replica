import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';



/**
 * custom navlink only for style reason
 * 
 * - in case of dropdown replaced by a div to not have a in a (href of item is the link)
 * @param {any} props 
 */
export default function StyledNavLink(props) {

    const history = useHistory();
    const [link, setLink] = useState({
        Hovered: false,
        Style: { color: 'black' }
    });


    const toggleHover = () => {
        setLink(() => {
            let newLink = { ...link };
            newLink.Hovered = !newLink.Hovered;
            newLink.Style = !newLink.Hovered ?
                { color: 'black', transition: '0.3s' } :
                { color: '#ed5b0d' };
            return newLink;
        });
    }

    const handleClick = (e) => {
        e.preventDefault();
        history.push("/" + props.link);
    }
    
    const getText = () => {
        let txt = "";
        switch (props.link) {
            case 'MyHistory':
                txt = 'My History';
                break;
            case 'RegisterOfBirths':
                txt = 'Register Of Births';
                break;
            default:
                txt = props.link;
                break;
        }
        return txt;
    }

    return (<>
        {!props.dropdown ?
            <Nav.Link eventKey={props.link} style={link.Style}
                onClick={handleClick} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                {getText()}
            </Nav.Link>
             :
            <div style={link.Style}
                onClick={handleClick} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                {getText()}
            </div>
        }</>
    );
}