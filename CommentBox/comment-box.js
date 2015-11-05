var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  debugger;


  // create container
  var container = HTMLElementHelper.createElement('div', {class:'container'}, {width:'400px', height:'100px'});
  var commentDisplayAreaContainer;
  var textAreaContainer;

  // create comment display area


  // create text-area

  // create button

  //





  this.appendChild(container);
};

CommentBox.attributeChangedCallback = function(attrName, oldVal, newVal) {
  console.log('attrb change:', attrName, oldVal, newVal)
  // if(attrName === 'value'){
  //   var bar = this.querySelector('div div');
  //   bar.style.width = (+newVal) + '%';
  // }
}

document.registerElement('comment-box',{
  prototype:CommentBox
});
