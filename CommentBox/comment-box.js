var CommentBoxHelper = {
  mapping: {},

  createCommentDisplayArea: function(container) {
    var commentDisplayAreaContainer = HTMLElementHelper.createElement('DIV', {'class': 'comment-display-area'});
    var commentList = HTMLElementHelper.createElement('UL', {'class': 'comment-list'});
    commentDisplayAreaContainer.appendChild(commentList);

    container.appendChild(commentDisplayAreaContainer);
    CommentBoxHelper.mapping.commentList = commentList;
  },

  createCommentArea: function(container, attrs) {
    var commentAreaContainer = HTMLElementHelper.createElement('DIV', {'class': 'comment-area'});
    var commentTextArea = HTMLElementHelper.createElement('TEXTAREA', {'class': 'comment-writer'});
    var limitLabel = HTMLElementHelper.createElement('LABEL', {'class': 'comment-limit-label', 'display': 'none'});

    if(attrs.hasOwnProperty('limit')) {
      commentTextArea.setAttribute('maxlength', attrs.limit);
      HTMLElementHelper.removeAttribute('display', limitLabel);
      CommentBoxHelper.updateLimitLabel(commentTextArea, limitLabel, parseInt(attrs.limit));
    }
    commentAreaContainer.appendChild(commentTextArea);
    var addCommentButton = HTMLElementHelper.createElement('BUTTON', {'class': 'comment-button'});
    addCommentButton.innerHTML = "Add Comment";
    commentAreaContainer.appendChild(addCommentButton); //
    commentAreaContainer.appendChild(limitLabel);

    container.appendChild(commentAreaContainer);

    CommentBoxHelper.mapping.commentTextArea = commentTextArea;
    CommentBoxHelper.mapping.limitLabel = limitLabel;
    CommentBoxHelper.mapping.addCommentButton = addCommentButton;
  },

  addComment: function(container, comment) {
    console.log(comment);
    var li = HTMLElementHelper.createElement('LI', {'class':'comment-list-item'});
    if(li.hasOwnProperty('innerText'))
      li.innerText = comment;
    else
      li.textContent = comment;
    container.appendChild(li);
  },

  updateLimitLabel: function(textArea, limitLabel, max) {
    var total = textArea.value.length;
    var text = total + ' / ' + max;
    if(limitLabel.hasOwnProperty('innerText'))
      limitLabel.innerText = text;
    else
      limitLabel.textContent = text;
  },

  get: function(key) {
    if(CommentBoxHelper.mapping.hasOwnProperty(key)) {
      return CommentBoxHelper.mapping[key];
    }
    return null;
  },

  bindAddCommentClickEvent: function() {
    CommentBoxHelper.get('addCommentButton').addEventListener('click', function(event) {
      var commentTextArea = CommentBoxHelper.get('commentTextArea');
      var text = commentTextArea.value;
      if(text == '') {
        return;
      }
      CommentBoxHelper.addComment(CommentBoxHelper.get('commentList'), text);
      commentTextArea.value = '';
    });
  },

  bindCommentTextAreaKeyupEvent: function(attrs) {
    var commentTextArea = CommentBoxHelper.get('commentTextArea');
    commentTextArea.addEventListener('keyup', function(event) {
      if(attrs.hasOwnProperty('limit')) {
        var max = parseInt(attrs.limit);
        CommentBoxHelper.updateLimitLabel(commentTextArea, CommentBoxHelper.get('limitLabel'), max);
      }
    });
  }
}

var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  var attrs = HTMLElementHelper.attrToJSON(this);
  // create container
  var container = HTMLElementHelper.createElement('DIV', {'class': 'comment-box'});

  // create comment display area
  CommentBoxHelper.createCommentDisplayArea(container);

  // create text-area
  CommentBoxHelper.createCommentArea(container, attrs);

  // button click event
  CommentBoxHelper.bindAddCommentClickEvent();

  // keypress event
  CommentBoxHelper.bindCommentTextAreaKeyupEvent(attrs);

  this.appendChild(container);
};

document.registerElement('comment-box', {
  prototype: CommentBox
});
