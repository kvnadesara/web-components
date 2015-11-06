var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  // create container
  var container = HTMLElementHelper.createElement('DIV', {'class': 'comment-box'});

  // create comment display area
  var commentDisplayAreaContainer = HTMLElementHelper.createElement('DIV', {'class': 'comment-display-area'});
  var commentList = HTMLElementHelper.createElement('UL', {'class': 'comment-list'});
  commentDisplayAreaContainer.appendChild(commentList);

  // create text-area
  var commentAreaContainer = HTMLElementHelper.createElement('DIV', {'class': 'comment-area'});
  var commentTextArea = HTMLElementHelper.createElement('TEXTAREA', {'class': 'comment-writer'});
  commentAreaContainer.appendChild(commentTextArea);
  var addCommentButton = HTMLElementHelper.createElement('BUTTON', {'class': 'comment-button'});
  addCommentButton.innerHTML = "Add Comment";
  commentAreaContainer.appendChild(addCommentButton); //
  addCommentButton.addEventListener('click', function(event) {
    //debugger;
    var text = commentTextArea.value;
    console.log(text);
    commentTextArea.value = ""
    var li = HTMLElementHelper.createElement('LI', {'class':'comment-list-item'});
    if(li.hasOwnProperty('innerText'))
      li.innerText = text;
    else
      li.textContent = text;
    commentList.appendChild(li);
  });

  commentTextArea.addEventListener('keypress', function(event, ele) {
    //console.log(event, ele);

  });


  container.appendChild(commentDisplayAreaContainer);
  container.appendChild(commentAreaContainer);
  this.appendChild(container);
};

CommentBox.attributeChangedCallback = function(attrName, oldVal, newVal) {
  console.log('attrb change:', attrName, oldVal, newVal)
    // if(attrName === 'value'){
    //   var bar = this.querySelector('div div');
    //   bar.style.width = (+newVal) + '%';
    // }
}

document.registerElement('comment-box', {
  prototype: CommentBox
});
