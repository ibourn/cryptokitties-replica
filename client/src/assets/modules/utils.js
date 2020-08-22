

const padZero = (str, len) => {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);

}

export var Color = {


formatHex: (str) => {
    return `#${str.padStart(6, '0')}`;
},



contrast: (hex, type) => {

    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert short from to plain
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    // to fit 6 digits
    if (hex.length !== 6) {
        hex.padStart(6, '0');
    } 
    // invalid hex
    if(hex.length > 6) {
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
    }
    else if(type === 'contrast'){
        r  += (r >= 127) ? -100 : 100;
        g  += (g >= 127) ? -100 : 100;
        b  += (b >= 127) ? -100 : 100;
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    else if(type === 'midDarken'){
        r  = Math.round(r/5);
        g  = Math.round(g/5);
        b  = Math.round(b/5);
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    else if(type === 'darken'){
        r  = Math.round(r/10);
        g  = Math.round(g/10);
        b  = Math.round(b/10);
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    else if(type === 'contrast'){
        r  += (r >= 127) ? -100 : 100;
        g  += (g >= 127) ? -100 : 100;
        b  += (b >= 127) ? -100 : 100;
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    else {
    // invert color 
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
}



}