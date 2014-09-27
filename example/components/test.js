/** @jsx React.DOM */
var Test = React.createClass({displayName: "Test",
  mixins: [ReactBEM],

  bem_blocks: ["widget"],
  bem_block_modifiers: ["christmas"],

  bem_render: function() {
    return (
      React.createElement("header", {className: "no-overwrite"}, 
        React.createElement("h1", null, React.createElement("span", {modifiers: "blinking"}, "HEADER:"), " This is the Header")
      )
    );
  }
});

document.addEventListener("DOMContentLoaded", function() {

  ReactDOM.render(
    React.createElement(Test, null),
    document.getElementsByTagName("body")[0]
  );

});
