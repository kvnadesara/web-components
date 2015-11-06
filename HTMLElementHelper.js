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
        debugger;
        if (typeof style === 'array') {
          style.forEach(function(s) {
            HTMLElementHelper.applyStyle(s, ele);
          });
        } else {
          HTMLElementHelper.applyStyle(s, ele);
        }
      }
    }
    return ele;
  },

  applyStyle: function(style, ele) {
    var sAr = s.split(":");
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
    debugger;
    var attrs = node.attributes;
    var attrJson = {};
    for (var i = 0; i < attrs.length; i++) {
      attrJson[attrs[i].name] = attrs[i].value;
    }

    return attrJson;
  }
}
