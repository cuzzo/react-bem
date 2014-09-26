/** @jsx React.DOM */
var Test = React.createClass({
  mixins: [ReactBEM],

  bem_blocks: ["widget"],
  bem_modifiers: [],

  bem_translate_class: function(bem_classes) {
    return bem_classes.split(" ").map(function(className) {
      return "translated-" + className;
    });
  },

  bem_render: function() {
    return (
      <header className="test">
        <h1><span modifiers="christmas">HEADER:</span> This is the Header</h1>
      </header>
    );
  }
});

document.addEventListener("DOMContentLoaded", function() {

  React.renderComponent(
    <Test />,
    document.getElementsByTagName("body")[0]
  );

});
