function CreateCommentBoxHelper(container) {
  var CommentBoxHelper = {
    /**
     * Socket instance
     * @type {Socket}
     */
    socket: null,

    /**
     * Main container
     * @type {DIV}
     */
    container: null,

    /**
     * Attributes of component
     * @type {Object}
     */
    attrs: {},

    /**
     * Create comment display area: comment-list
     */
    createCommentDisplayArea: function() {
      var commentDisplayAreaContainer = HTMLElementHelper.createElement('DIV', {
        'class': 'comment-display-area'
      });
      var commentList = HTMLElementHelper.createElement('UL', {
        'class': 'comment-list'
      });
      commentDisplayAreaContainer.appendChild(commentList);

      this.container.appendChild(commentDisplayAreaContainer);
    },

    /**
     * Create comment area: comment-writer, comment-button, comment-maxlength-label
     */
    createCommentArea: function() {
      var commentAreaContainer = HTMLElementHelper.createElement('DIV', {
        'class': 'comment-area'
      });
      var commentTextArea = HTMLElementHelper.createElement('TEXTAREA', {
        'class': 'comment-writer'
      });

      if (this.attrs.hasOwnProperty('maxlength')) {
        commentTextArea.setAttribute('maxlength', this.attrs.maxlength);
      }

      if (this.attrs.hasOwnProperty('showmaxlength')) {
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

      commentAreaContainer.appendChild(addCommentButton);
      this.container.appendChild(commentAreaContainer);

      this.updateMaxlengthLabel();
    },

    /**
     * Add comment to comment-list
     * @param  {String} comment Comment to be added to comment-list
     */
    addComment: function(comment) {
      console.log(comment);
      var container = this.get('.comment-display-area .comment-list');
      var li = HTMLElementHelper.createElement('LI', {
        'class': 'comment-list-item'
      });
      if (li.hasOwnProperty('innerText'))
        li.innerText = comment;
      else
        li.textContent = comment;
      container.appendChild(li);
    },

    /**
     * Update total no. of character typed in comment-writer vs. maxlength (if specified)
     */
    updateMaxlengthLabel: function() {
      var maxlengthLabel = this.get('.comment-area .comment-maxlength-label');

      if (maxlengthLabel == null) {
        return;
      }

      var commentTextArea = this.get('.comment-area .comment-writer');
      var total = commentTextArea.value.length;
      var text = total;
      if (this.attrs.hasOwnProperty('maxlength')) {
        var max = parseInt(this.attrs.maxlength);
        var text = total + ' / ' + max;
      }
      if (maxlengthLabel.hasOwnProperty('innerText'))
        maxlengthLabel.innerText = text;
      else
        maxlengthLabel.textContent = text;
    },

    /**
     * Query the container to get specified element
     * @param  {String} key element key
     */
    get: function(key) {
      return this.container.querySelector(key);
    },

    /**
     * Bind add comment button click event
     */
    bindAddCommentClickEvent: function() {
      this.get('.comment-area .comment-button').addEventListener('click', function(event) {
        debugger;
        var commentTextArea = CommentBoxHelper.get('.comment-area .comment-writer');
        var text = commentTextArea.value;
        if (text == '') {
          return;
        }
        CommentBoxHelper.addComment(text);
        commentTextArea.value = '';
        CommentBoxHelper.updateMaxlengthLabel();
        CommentBoxHelper.socket.emit('message', {
          uuid: CommentBoxHelper.attrs.uuid,
          data: text
        });
      });
    },

    /**
     * Bind comment-writer keyup event to update comment-maxlength-label
     */
    bindCommentTextAreaKeyupEvent: function() {
      var commentTextArea = this.get('.comment-area .comment-writer');
      commentTextArea.addEventListener('keyup', function(event) {
        CommentBoxHelper.updateMaxlengthLabel();
      });
    },

    /**
     * Attribute change event
     * @param  {String} attr   Attribute name
     * @param  {String} oldVal Old value of Attribute
     * @param  {String} newVal New value of Attribute
     */
    attributeChanged: function(attr, oldVal, newVal) {
      console.log("Attribute changed: attr: %s | old-value: %s | new-value: %s", attr, oldVal, newVal);
      this.attrs[attr] = newVal;
      switch (attr) {
        case 'showmaxlenght':
          this.showHideMaxlengthLabel(newVal != null);
          break;
        case 'maxlength':
          var commentTextArea = this.get('.comment-area .comment-writer');
          commentTextArea.setAttribute('maxlength', parseInt(newVal));
          this.updateMaxlengthLabel();
          break;
      }
    },

    /**
     * Show / hide maxlength-label
     * @param  {Boolean} show true to display maxlength-label, false otherwise.
     */
    showHideMaxlengthLabel: function(show) {
      var maxlengthLabel = this.get('.comment-area .comment-maxlength-label');
      if (maxlengthLabel == null) {
        var maxlengthLabel = HTMLElementHelper.createElement('LABEL', {
          'class': 'comment-maxlength-label',
        });
        this.get('.comment-area').appendChild(maxlengthLabel);
      }

      if (show === true) {
        maxlengthLabel.removeAttribute('display');
      } else {
        maxlengthLabel.setAttribute('display', 'none');
      }
    },
  }

  CommentBoxHelper.container = container;
  return CommentBoxHelper;
}

var CommentBox = Object.create(HTMLElement.prototype);

CommentBox.createdCallback = function() {
  // create container
  var container = HTMLElementHelper.createElement('DIV', {
    'class': 'comment-box'
  });
  var CommentBoxHelper = CreateCommentBoxHelper(container);
  CommentBoxHelper.attrs = HTMLElementHelper.attrToJSON(this);

  // create comment display area
  CommentBoxHelper.createCommentDisplayArea();

  // create text-area
  CommentBoxHelper.createCommentArea();

  // button click event
  CommentBoxHelper.bindAddCommentClickEvent();

  // keypress event
  CommentBoxHelper.bindCommentTextAreaKeyupEvent();

  var uuid = CommentBoxHelper.attrs.uuid || '';
  var server = CommentBoxHelper.attrs.server || 'http://localhost:3000';

  CommentBoxHelper.socket = io(server);

  CommentBoxHelper.socket.on('connect', function() {
    CommentBoxHelper.socket.emit('subscribe', uuid);
    var button = CommentBoxHelper.get('.comment-area .comment-button');
    button.removeAttribute('disabled');
  });

  CommentBoxHelper.socket.on('subscriptionStatus', function(status) {
    console.log(status);
  });

  CommentBoxHelper.socket.on('message', function(message) {
    console.log(message);
    debugger;
    // if socket is connected to same server then it share the instance
    if (message.uuid === CommentBoxHelper.attrs.uuid)
      CommentBoxHelper.addComment(message.data);
  });

  CommentBoxHelper.socket.on('disconnect', function() {
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
