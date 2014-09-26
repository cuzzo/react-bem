/** @jsx React.DOM */
var Test = React.createClass({
  mixins: [ReactBEM],

  getInitialState: function() {
    this.bem_blocks = ["widget"];
    this.bem_block_modifiers = [];
    return this;
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
