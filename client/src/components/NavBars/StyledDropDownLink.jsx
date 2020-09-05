import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';




export default function StyledNavLink(props) {

    const history = useHistory();
    const [link, setLink] = useState({
        Hovered: false,
        Style : {color: 'black'}
      });
    
    
    const toggleHover = () => {
      setLink(()=>{
        let newLink = {...link};    
        newLink.Hovered = !newLink.Hovered;
        newLink.Style = !newLink.Hovered ? 
           {color: 'black', transition: '0.3s'} :
           {color: '#ed5b0d'};
        return newLink;
      });
    }

      const handleClick=(e) => {
        e.preventDefault();
        history.push("/" + props.link);
      }

      const getText = () => {
          let txt = "";
          switch(props.link){
              case 'MyHistory':
                  txt = 'My History';
                  break;
                case 'RegisterOfBirths':
                    txt = 'Register Of Births';
                    break;
                    default:
                        break;
          }
          return txt;
      }

    return( 
    <div style={link.Style} 
    onClick={handleClick} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
      {getText()}
    </div>
    );
}