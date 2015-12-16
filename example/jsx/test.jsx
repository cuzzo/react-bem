/** @jsx React.DOM */
var Test = React.createClass({
  mixins: [ReactBEM],

  bem_blocks: ["widget"],
  bem_block_modifiers: ["christmas"],

  bem_render: function() {
    return (
      <header className="no-overwrite">
        <h1><span modifiers="blinking">HEADER:</span> This is the Header</h1>
      </header>
    );
  }
});

document.addEventListener("DOMContentLoaded", function() {

  ReactDOM.render(
    <Test />,
    document.getElementsByTagName("body")[0]
  );

});
