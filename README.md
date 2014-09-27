# React BEM

BEM class names are systematic. So why write them yourself?

# Usage

React BEM automatically generates BEM style classes on React components... So you don't have to.

# Example

JSX Component:

```javascript
var Header = React.createClass({
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
```

Translates to:

```html
<header class="no-overwrite widget--christmas__header widget__header" data-reactid=".0">

    <h1 class="widget--christmas__h1 widget__h1" data-reactid=".0.0">
        <span class="widget--christmas__span--blinking widget--christmas__span widget__span--blinking widget__span" data-reactid=".0.0.0"></span>
        <span data-reactid=".0.0.1">

             This is the Header

        </span>
    </h1>

</header>
```

You can see it live, how it attaches the BEM classes, [here](http://cuzzo.github.io/react-bem/example/ "React autogenerate BEM class names example")

# License

React BEM is free--as in BSD. Hack your heart out, hackers.
