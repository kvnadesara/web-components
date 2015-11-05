var ProgressBar  = Object.create(HTMLElement.prototype);

ProgressBar.createdCallback = function() {
  debugger;
  var outerBar = document.createElement('div');
  outerBar.style.width="100px";
  outerBar.style.height="20px";
  outerBar.style.background="#F9F9F9";
  outerBar.style.border="1px solid steelblue";
  outerBar.style.padding="1px";
  outerBar.style.margin="10px";

  var innerBar = document.createElement('div');
  innerBar.style.background="steelblue";
  innerBar.style.height="100%";
  innerBar.style.width=(+this.getAttribute('value') || 0)+'%';
  outerBar.appendChild(innerBar);
  this.appendChild(outerBar);
};

ProgressBar.attributeChangedCallback = function(attrName, oldVal, newVal) {
  debugger;
  console.log(attrName, oldVal, newVal)
  if(attrName === 'value'){
    var bar = this.querySelector('div div');
    bar.style.width = (+newVal) + '%';
  }
}

document.registerElement('progress-bar',{
  prototype:ProgressBar
});
