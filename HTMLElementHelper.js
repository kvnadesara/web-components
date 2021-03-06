var HTMLElementHelper = {
  /**
   * Create an HTML node with provided attributes and style
   * @param  {String} eleName Name of an element
   * @param  {Object} attrs  Attributes object
   * @return {HTMLElement}         Html element
   */
  createElement: function(eleName, attrs) {
    var ele = document.createElement(eleName);
    if (attrs != undefined) {
      var style = null;
      if (attrs.style != undefined) {
        style = attrs.style.split(";");
        delete attrs.style;
      }

      for (key in attrs) {
        ele.setAttribute(key, attrs[key]);
      }

      if (style) {

        if (Object.prototype.toString.call( style ) === '[object Array]') {
          style.forEach(function(s) {
            HTMLElementHelper.applyStyle(ele, s);
          });
        } else {
          HTMLElementHelper.applyStyle(ele, style);
        }
      }
    }
    return ele;
  },

  /**
   * Apply style to element
   * @param  {String} style style
   * @param  {HTMLElement} ele   element
   */
  applyStyle: function(ele, style) {
    var sAr = style.split(":");
    if (sAr && sAr.length != 2)
      return;
    var key = '"' + sAr[0].trim().replace(/"/g, '') + '"';
    var val = sAr[1].trim();
    ele.style[key] = val;
  },
  
  /**
   * Create an Object of attributes of given node
   * @param  {HTMLElement} node Html element
   * @return {Object}      Attributes object
   */
  attrToJSON: function(node) {
    var attrs = node.attributes;
    var attrJson = {};
    for (var i = 0; i < attrs.length; i++) {
      attrJson[attrs[i].name] = attrs[i].value;
    }

    return attrJson;
  },
}
