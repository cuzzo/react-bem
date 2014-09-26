/** @jsx React.DOM */
var Test = React.createClass({
  mixins: [ReactBEM],

  bem_blocks: ["widget"],
  bem_modifiers: [],

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
