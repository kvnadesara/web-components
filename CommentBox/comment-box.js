var CommentBoxHelper = {
  mapping: {},
  attrs: {},

  createCommentDisplayArea: function(container) {
    var commentDisplayAreaContainer = HTMLElementHelper.createElement('DIV', {
      'class': 'comment-display-area'
    });
    var commentList = HTMLElementHelper.createElement('UL', {
      'class': 'comment-list'
    });
    commentDisplayAreaContainer.appendChild(commentList);

    container.appendChild(commentDisplayAreaContainer);
    CommentBoxHelper.mapping.commentList = commentList;
  },

  createCommentArea: function(container) {
    var commentAreaContainer = HTMLElementHelper.createElement('DIV', {
      'class': 'comment-area'
    });
    var commentTextArea = HTMLElementHelper.createElement('TEXTAREA', {
      'class': 'comment-writer'
    });
    var maxlengthLabel = HTMLElementHelper.createElement('LABEL', {
      'class': 'comment-maxlength-label',
      'display': 'none'
    });

    if (CommentBoxHelper.attrs.hasOwnProperty('maxlength')) {
      commentTextArea.setAttribute('maxlength', CommentBoxHelper.attrs.maxlength);
    }

    if (CommentBoxHelper.attrs.hasOwnProperty('showmaxlength')) {
      maxlengthLabel.removeAttribute('display');
    }

    commentAreaContainer.appendChild(commentTextArea);
    var addCommentButton = HTMLElementHelper.createElement('BUTTON', {
      'class': 'comment-button'
    });
    addCommentButton.innerHTML = "Add Comment";
    commentAreaContainer.appendChild(addCommentButton); //
    commentAreaContainer.appendChild(maxlengthLabel);

    container.appendChild(commentAreaContainer);

    CommentBoxHelper.mapping.commentTextArea = commentTextArea;
    CommentBoxHelper.mapping.maxlengthLabel = maxlengthLabel;
    CommentBoxHelper.mapping.addCommentButton = addCommentButton;
    CommentBoxHelper.updateMaxlengthLabel();
  },

  addComment: function(container, comment) {
    console.log(comment);
    var li = HTMLElementHelper.createElement('LI', {
      'class': 'comment-list-item'
    });
    if (li.hasOwnProperty('innerText'))
      li.innerText = comment;
    else
      li.textContent = comment;
    container.appendChild(li);
  },

  updateMaxlengthLabel: function() {
    var commentTextArea = CommentBoxHelper.get('commentTextArea');
    var maxlengthLabel = CommentBoxHelper.get('maxlengthLabel');
    var total = commentTextArea.value.length;
    var text = total;
    if (CommentBoxHelper.attrs.maxlength != undefined) {
      var max = parseInt(CommentBoxHelper.attrs.maxlength);
      var text = total + ' / ' + max;
    }
    if (maxlengthLabel.hasOwnProperty('innerText'))
      maxlengthLabel.innerText = text;
    else
      maxlengthLabel.textContent = text;
  },

  get: function(key) {
    if (CommentBoxHelper.mapping.hasOwnProperty(key)) {
      return CommentBoxHelper.mapping[key];
    }
    return null;
  },

  bindAddCommentClickEvent: function() {
    CommentBoxHelper.get('addCommentButton').addEventListener('click', function(event) {
      var commentTextArea = CommentBoxHelper.get('commentTextArea');
      var text = commentTextArea.value;
      if (text == '') {
        return;
      }
      CommentBoxHelper.addComment(CommentBoxHelper.get('commentList'), text);
      commentTextArea.value = '';
      CommentBoxHelper.updateMaxlengthLabel();
    });
  },

  bindCommentTextAreaKeyupEvent: function() {
    var commentTextArea = CommentBoxHelper.get('commentTextArea');
    commentTextArea.addEventListener('keyup', function(event) {
      CommentBoxHelper.updateMaxlengthLabel();
    });
  },

  attributeChanged: function(attr, oldVal, newVal) {
    console.log("Attribute changed: attr: %s | old-value: %s | new-value: %s", attr, oldVal, newVal);
    CommentBoxHelper.attrs[attr] = newVal;
    switch (attr) {
      case 'showmaxlenght':
        CommentBoxHelper.showHideMaxlengthLabel(newVal != null);
        break;
      case 'maxlength':
        var commentTextArea = CommentBoxHelper.get('commentTextArea');
        commentTextArea.setAttribute('maxlength', parseInt(newVal));
        CommentBoxHelper.updateMaxlengthLabel();
        break;
    }
  },

  showHideMaxlengthLabel: function(show) {
    var maxlengthLabel = CommentBoxHelper.get('maxlengthLabel');
    if(show === true) {
      maxlengthLabel.removeAttribute('display');
    } else {
      maxlengthLabel.setAttribute('display', 'none');
    }
  }
}

var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  CommentBoxHelper.attrs = HTMLElementHelper.attrToJSON(this);
  // create container
  var container = HTMLElementHelper.createElement('DIV', {
    'class': 'comment-box'
  });
  CommentBoxHelper.mapping.container = container;

  // create comment display area
  CommentBoxHelper.createCommentDisplayArea(container);

  // create text-area
  CommentBoxHelper.createCommentArea(container);

  // button click event
  CommentBoxHelper.bindAddCommentClickEvent();

  // keypress event
  CommentBoxHelper.bindCommentTextAreaKeyupEvent();

  this.appendChild(container);
};

CommentBox.attributeChangedCallback = function(attrName, oldVal, newVal) {
  CommentBoxHelper.attributeChanged(attrName, oldVal, newVal);
};

document.registerElement('comment-box', {
  prototype: CommentBox
});
