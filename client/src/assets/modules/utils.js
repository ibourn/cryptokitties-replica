
import { allEyeVariations } from '../../assets/modules/eyevariations';
import { allPatternVariations } from '../../assets/modules/patternvariations';
import { allAnimations } from '../../assets/modules/animations';

/*
set of available eyes variations
*/
const eyeVariations = Object.values(allEyeVariations());
/*
set of available pattern variations
*/
const patternVariations = Object.values(allPatternVariations());
/*
set of available animations
*/
const animations = Object.values(allAnimations());


/**
   * 
   * utility to manipulate dna :
   * 
   */
export var Genes = {
    /*format the code value to the corresponding name to display (number to string)*/
    convertValue: (item, value) => {
        let valueToDisplay = "";
        switch (item) {
            case 'eyesShape':
                valueToDisplay = eyeVariations[value];
                break;
            case 'decorationPattern':
                valueToDisplay = patternVariations[value];
                break;
            case 'animation':
                valueToDisplay = animations[value];
                break;
            default:
                valueToDisplay = value;
        }
        return valueToDisplay;
    },

    /*format dna from string of numbers to object*/
    dnaStrToObj: (dna) => {
        return ({
            headColor: dna.slice(0, 2),
            mouthColor: dna.slice(2, 4),
            eyesColor: dna.slice(4, 6),
            earsColor: dna.slice(6, 8),
            eyesShape: dna.slice(8, 9),
            decorationPattern: dna.slice(9, 10),
            decorationMidcolor: dna.slice(10, 12),
            decorationSidescolor: dna.slice(12, 14),
            animation: dna.slice(14, 15),
            lastNum: dna.slice(15)

        });
    }
}



/**
 * Color helpers
 */
export var Color = {
    /**
     * format to #rrggbb
     */
    formatHex: (str) => {
        return `#${str.padStart(6, '0')}`;
    },

    /**
     * params : hex color
     * params : type : b&w, midDarken, darken, default : invert
     */
    contrast: (hex, type) => {

        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert short form to full
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        // to fit 6 digits
        if (hex.length !== 6) {
            hex.padStart(6, '0');
        }
        // invalid hex
        if (hex.length > 6) {
            throw new Error('Invalid HEX color.');
        }

        let r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);

        if (type === 'b&w') {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        } else {

            switch (type) {
                case 'contrast':
                    r += (r >= 127) ? -100 : 100;
                    g += (g >= 127) ? -100 : 100;
                    b += (b >= 127) ? -100 : 100;
                    break;
                case 'midDarken':
                    r = Math.round(r / 5);
                    g = Math.round(g / 5);
                    b = Math.round(b / 5);
                    break;
                case 'darken':
                    r = Math.round(r / 10);
                    g = Math.round(g / 10);
                    b = Math.round(b / 10);
                    break;
                default:
                    // invert color 
                    r = (255 - r).toString(16);
                    g = (255 - g).toString(16);
                    b = (255 - b).toString(16);
            }
            return ("#" + (r.toString()).padStart(2, '0') +
                (g.toString()).padStart(2, '0') + (b.toString()).padStart(2, '0'));

        }
    }
}

/**
 * Maths-Random helpers
 */
export var Random = {
    /**
     * generate random number betwwen min and max
     * 
     * params: min, max : number
     */
    inRange: (min, max) => {
        return (Math.floor(Math.random() * (max - min - 1)) + min);
    }

}



/**
 * Copy helpers
 */
export var Copy = {
    shallow: (element) => {
        if (typeof element == "object") {
            return { ...element };
        } else {
            return element;
        }
    },
    deep: (element) => {
        if (Array.isArray(element)) {
            return [...element];
        } else if (typeof element == "object") {
            return JSON.parse(JSON.stringify(element));
        } else {
            return element;
        }
    },
    nested: (element) => {
        let deepCopy = (element) => {
            //If not a object then return
            if (!element) {
                return element;
            }

            let item;
            let copy = Array.isArray(element) ? [] : {};

            for (const i in element) {
                item = element[i];
                copy[i] = (typeof item === "object") ? deepCopy(item) : item;
            }
            return copy;
        }
        return deepCopy(element);
    }

}


/**
   * 
   * utility to manipulate time :
   * 
   */
export var Time = {
    /* timestamp to yyyy/mm/dd hh:mm:ss*/
    fromTimestamp: (t) => {
        const dt = new Date(t * 1000);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1).toString();
        const d = dt.getDate().toString();
        const hr = dt.getHours().toString();
        const min = dt.getMinutes().toString();
        const s = dt.getSeconds().toString();
        if (y && m && d && hr && min && s) {
            return y + '/' + m.padStart(2, "0") + '/' + d.padStart(2, "0") + ' ' + hr.padStart(2, "0") + ':' + min.padStart(2, "0") + ':' + s.padStart(2, "0");
        } else {
            return "no data.."
        }
    }
}