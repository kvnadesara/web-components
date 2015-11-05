var HTMLElementHelper = {
  /**
   * Create an HTML node with provided attributes and style
   * @param  {String} eleName Name of an element
   * @param  {Object} attrbs  Attributes object
   * @return {HTMLElement}         Html element
   */
  createElement: function(eleName, attrbs) {
    debugger;
    var ele = document.createElement(eleName);

    var style = attrbs.style;
    delete attrbs.style;

    for(key in attrbs) {
      ele.setAttribute(key, attrbs[key]);
    }

    ele.style = style;

    return ele;
  },

  /**
   * Create an Object of attributes of given node
   * @param  {HTMLElement} node Html element
   * @return {Object}      Attributes object
   */
  attrToJSON: function(node) {
    debugger;
    var attrbs = node.attributes;
    var attrJson = {};
    for(var i=0; i<attrbs.length; i++) {
      attrJson[attrbs[i].name] = attrbs[i].value;
    }

    return attrJson;
  }
}
