var React = require('react');
function forRange(n, f) {
    var ret = [];
    for (var i = 0; i < n; i++)
        ret.push(f(i));
    return ret;
}
exports.ReactSvg = React.createClass({
    getDefaultProps: function () {
        return {
            MANA: 1, GOLD: 0,
            IMAGE_FILE: 'http://vignette3.wikia.nocookie.net/monster/images/f/fc/Ogre.gif/revision/latest?cb=20110129220228',
            HEALTH: 100,
            NAME: '<\'name\' needed>',
            DESCRIPTION: '<\'description\' needed>',
            MOVEMENT: 2,
            RANGE: 2,
            AMOUNT: 0 / 2,
            TRAIT1: '',
            TRAIT2: '',
            TRAIT3: '',
            ABILITY1: ''
        };
    },
    render: function () {
        return (React.createElement("svg", {"height": "21.198195mm", "id": "svg4263", "width": "122.20753mm", "version": "1.1", "viewBox": "0 0 433.01881 75.111713"}, React.createElement("defs", {"id": "defs4265"}), React.createElement("g", {"id": "layer1", "transform": "translate(-502.18616,-154.04271)"}, React.createElement("g", {"id": "g4227", "transform": "matrix(2.3099987,0,0,2.3099987,-514.48236,-993.93466)"}, React.createElement("rect", {"height": "30.515911", "id": "rect4829-0-0", "style": { "opacity": "1", "fill": "#000000", "fillOpacity": "1", "stroke": "#000000", "strokeWidth": "2.00000024", "strokeMiterlimit": "4", "strokeDasharray": "none", "strokeOpacity": "1" }, "width": "170", "ry": "0", "transform": "translate(3.9464118e-6,3.7127091e-6)", x: "441.11649", y: "497.96017"}), React.createElement("g", {"id": "g4224", "style": { "fill": "#f9f9f9" }, "transform": "translate(53.999947,-23.000361)"}, React.createElement("image", {"height": "27.705643", "id": "image4263", "style": { "fill": "#f9f9f9", "imageRendering": "optimizeSpeed" }, "width": "27.705643", "preserveAspectRatio": "none", x: "441.32248", y: "522.19153", "xlinkHref": "images/blast.png"}), React.createElement("text", {"id": "text4686-8-5-0-5-5", "style": { "fontStyle": "normal", "fontWeight": "normal", "fontSize": "16.10652733px", "lineHeight": "125%", "fontFamily": "sans-serif", "textAlign": "end", "letterSpacing": "0px", "wordSpacing": "0px", "textAnchor": "end", "fill": "#ffffff", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }, "transform": "scale(0.81996067,1.2195707)", x: "588.66003", y: "443.42676", "xmlSpace": "preserve"}, React.createElement("tspan", {"id": "tspan4688-1-5-2-6-1", "style": { "fontWeight": "bold", "textAlign": "center", "textAnchor": "middle", "fill": "#ffffff" }, x: "588.66003", y: "443.42676"}, this.props.MANA)), React.createElement("image", {"height": "27.705643", "id": "image4545", "width": "27.705643", "preserveAspectRatio": "none", x: "499.46326", y: "522.01508", "xlinkHref": "images/health.png"}), React.createElement("text", {"id": "text4686-8-5-0-5-5-7", "style": { "fontStyle": "normal", "fontWeight": "normal", "fontSize": "16.10652733px", "lineHeight": "125%", "fontFamily": "sans-serif", "textAlign": "end", "letterSpacing": "0px", "wordSpacing": "0px", "textAnchor": "end", "fill": "#ffffff", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }, "transform": "scale(0.81996067,1.2195707)", x: "660.8952", y: "443.06995", "xmlSpace": "preserve"}, React.createElement("tspan", {"id": "tspan4688-1-5-2-6-1-5", "style": { "fontWeight": "bold", "textAlign": "center", "textAnchor": "middle", "fill": "#ffffff" }, x: "660.8952", y: "443.06995"}, this.props.HEALTH))), React.createElement("image", {"height": "27.705643", "id": "image4243", "style": { "fill": "#f9f9f9", "imageRendering": "optimizeSpeed" }, "width": "27.705643", "preserveAspectRatio": "none", x: "441.59085", y: "499.19168", "xlinkHref": "images/coin.png"})), React.createElement("g", {"id": "g4229", "style": { "fill": "#f9f9f9" }, "transform": "matrix(2.3099987,0,0,2.3099987,-509.86234,-991.93469)"}, React.createElement("text", {"id": "text4686-8-5-0-5", "style": { "fontStyle": "normal", "fontWeight": "normal", "fontSize": "16.10652733px", "lineHeight": "125%", "fontFamily": "sans-serif", "textAlign": "end", "letterSpacing": "0px", "wordSpacing": "0px", "textAnchor": "end", "fill": "#ffffff", "fillOpacity": "1", "stroke": "none", "strokeWidth": "1px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeOpacity": "1" }, "transform": "scale(0.81996067,1.2195707)", x: "580.17474", y: "423.86481", "xmlSpace": "preserve"}, React.createElement("tspan", {"id": "tspan4688-1-5-2-6", "style": { "fontWeight": "bold", "textAlign": "center", "textAnchor": "middle", "fill": "#ffffff" }, x: "580.17474", y: "423.86481"}, this.props.GOLD))))));
    }
});
