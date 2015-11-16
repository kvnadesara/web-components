# CommentBox

Comment box is a simple yet powerful component to integrate commenting feature
in a page/blog.

Example:
```html
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.16/webcomponents.js" charset="utf-8"></script>
  <script src="https://cdn.socket.io/socket.io-1.3.7.js"></script>
  <script src="HTMLElementHelper.js"></script>
  <script src="comment-box.js"></script>
  <link href="comment-box.css" rel="stylesheet" charset="utf-8">
</head>
<comment-box> </comment-box>
```

#### Properties

| Property | Type | Description | Ver |
| -------- | ---- | ----------- | ------- |
| `maxlength` | Integer | set max. character limit | 1.0 |
| `showmaxlenght` | Boolean | display max. length character label | 1.0 |
| `uuid` | String | unique id of component | 1.2 |
| `server` | String | url of server where component will be connected to socket | 1.2 |

#### v1.2

Added properties UUID, SERVER

#### v1.1

Integrated socket to connect to Axiom platform

#### v1.0

It's a simple version of comment-box. Write comment and click on `Add Comment`
button, it will add comment in display area.

```
DOM
===
comment-box
|__div.container
   |__div.comment-display-area
   |  |__ul.comment-list
   |     |__li.comment-list-item
   |     |__li.comment-list-item
   |     .
   |     .
   |     . n-comments
   |
   |__div.comment-area
      |__textarea.comment-writer
      |__button.comment-button
      |__label.comment-maxlength-label

```
