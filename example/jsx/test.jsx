/** @jsx React.DOM */
var Test = React.createClass({
  mixins: [ReactBEM],

  bem_blocks: ["widget"],
  bem_block_modifiers: ["christmas"],

  bem_translate_class: function(bem_classes) {
    return bem_classes.split(" ").map(function(className) {
      return "translated-" + className;
    }).join(" ");
  },

  bem_render: function() {
    return (
      <header className="no-overwrite">
        <h1><span modifiers="blinking">HEADER:</span> This is the Header</h1>
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
