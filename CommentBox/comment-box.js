var groupName = window.location.href;
var socket = io('http://localhost:3000');

var CommentBoxHelper = {
  container: null,  // main container div
  attrs: {},

  createCommentDisplayArea: function() {
    var commentDisplayAreaContainer = HTMLElementHelper.createElement('DIV', {
      'class': 'comment-display-area'
    });
    var commentList = HTMLElementHelper.createElement('UL', {
      'class': 'comment-list'
    });
    commentDisplayAreaContainer.appendChild(commentList);

    CommentBoxHelper.container.appendChild(commentDisplayAreaContainer);
  },

  createCommentArea: function() {
    var commentAreaContainer = HTMLElementHelper.createElement('DIV', {
      'class': 'comment-area'
    });
    var commentTextArea = HTMLElementHelper.createElement('TEXTAREA', {
      'class': 'comment-writer'
    });

    if (CommentBoxHelper.attrs.hasOwnProperty('maxlength')) {
      commentTextArea.setAttribute('maxlength', CommentBoxHelper.attrs.maxlength);
    }

    if (CommentBoxHelper.attrs.hasOwnProperty('showmaxlength')) {
      var maxlengthLabel = HTMLElementHelper.createElement('LABEL', {
        'class': 'comment-maxlength-label',
      });
      commentAreaContainer.appendChild(maxlengthLabel);
    }

    commentAreaContainer.appendChild(commentTextArea);
    var addCommentButton = HTMLElementHelper.createElement('BUTTON', {
      'class': 'comment-button'
    });
    addCommentButton.innerHTML = "Add Comment";
    commentAreaContainer.appendChild(addCommentButton); //


    CommentBoxHelper.container.appendChild(commentAreaContainer);

    CommentBoxHelper.updateMaxlengthLabel();
  },

  addComment: function(comment) {
    console.log(comment);
    var container = CommentBoxHelper.get('.comment-display-area .comment-list');
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
    var maxlengthLabel = CommentBoxHelper.get('.comment-area .comment-maxlength-label');

    if(maxlengthLabel == null) {
      return;
    }

    var commentTextArea = CommentBoxHelper.get('.comment-area .comment-writer');
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
    return CommentBoxHelper.container.querySelector(key);
  },

  bindAddCommentClickEvent: function() {
    CommentBoxHelper.get('.comment-area .comment-button').addEventListener('click', function(event) {
      var commentTextArea = CommentBoxHelper.get('.comment-area .comment-writer');
      var text = commentTextArea.value;
      if (text == '') {
        return;
      }
      CommentBoxHelper.addComment(text);
      commentTextArea.value = '';
      CommentBoxHelper.updateMaxlengthLabel();
      socket.emit('message', {data:text});
    });
  },

  bindCommentTextAreaKeyupEvent: function() {
    var commentTextArea = CommentBoxHelper.get('.comment-area .comment-writer');
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
        var commentTextArea = CommentBoxHelper.get('.comment-area .comment-writer');
        commentTextArea.setAttribute('maxlength', parseInt(newVal));
        CommentBoxHelper.updateMaxlengthLabel();
        break;
    }
  },

  showHideMaxlengthLabel: function(show) {
    var maxlengthLabel = CommentBoxHelper.get('.comment-area .comment-maxlength-label');
    if(maxlengthLabel == null)
      return;
    if(show === true) {
      maxlengthLabel.removeAttribute('display');
    } else {
      maxlengthLabel.setAttribute('display', 'none');
    }
  },
}

var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  CommentBoxHelper.attrs = HTMLElementHelper.attrToJSON(this);
  // create container
  CommentBoxHelper.container = HTMLElementHelper.createElement('DIV', {
    'class': 'comment-box'
  });

  // create comment display area
  CommentBoxHelper.createCommentDisplayArea();

  // create text-area
  CommentBoxHelper.createCommentArea();

  // button click event
  CommentBoxHelper.bindAddCommentClickEvent();

  // keypress event
  CommentBoxHelper.bindCommentTextAreaKeyupEvent();

  socket.on('connect', function() {
    socket.emit('subscribe', groupName);
    var button = CommentBoxHelper.get('.comment-area .comment-button');
    button.removeAttribute('disabled');
  });

  socket.on('subscriptionStatus', function(status){
    console.log(status);
  });

  socket.on('message', function(message) {
    console.log(message);
    CommentBoxHelper.addComment(message.data);
  });

  socket.on('disconnect', function() {
    var button = CommentBoxHelper.get('.comment-area .comment-button');
    button.setAttribute('disabled', 'disabled');
  });

  this.appendChild(CommentBoxHelper.container);
};

CommentBox.attributeChangedCallback = function(attrName, oldVal, newVal) {
  CommentBoxHelper.attributeChanged(attrName, oldVal, newVal);
};

document.registerElement('comment-box', {
  prototype: CommentBox
});
