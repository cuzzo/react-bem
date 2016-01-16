import React from 'react';
import ReactAddons from 'react/addons';
import { Component } from 'react'
import { assert } from 'chai';
import withBEM from '../src/react-bem';
import { jsdom } from 'jsdom';

function propagate_globally (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue
    global[key] = window[key]
  }
}

let doc = jsdom("<!doctype html><html><body></body></html>"),
    win = doc.defaultView;
global.document = doc;
global.window = win;
propagate_globally(win);

import ReactDOM from 'react-dom';

describe("BEM transfomration", function() {
  let { TestUtils } = ReactAddons.addons;

  let connect = function(Component) {
    return TestUtils.renderIntoDocument(React.createElement(Component));
  };

  let unmount_component = function(component) {
    React.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
  };

  let getTypeOfDomNode = function (el) {
    let reactComponent = el._reactInternalComponent._currentElement;
    let name = '';
    if (typeof reactComponent.type === "string") {
      name = reactComponent.type
    } else {
      name = reactComponent.type.displayName
    }

    return name;
  }

  assert.bem_exists = function(component, bem_class_name, tag_name) {
    let el = TestUtils.findRenderedDOMComponentWithClass(
        component,
        bem_class_name
      );

    assert.equal(getTypeOfDomNode(el), tag_name);
  };

  assert.bem_not_exists = function(component, bem_class_name) {
    let els = TestUtils.scryRenderedDOMComponentsWithClass(
        component,
        bem_class_name
      );
    assert.equal(els.length, 0);
  };

  describe("Single Element BEM Formation", () => {
    it("formulates (B)lock and (E)lement", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
    });

    it("preserves existing classes", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header className="no-overwrite" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("overwrites tagname with role", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header className="no-overwrite" role="title" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__title", "header");
      assert.bem_not_exists(component, "widget__header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("overwrites tagname with bem_element", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header className="no-overwrite" bem_element="caption" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__caption", "header");
      assert.bem_not_exists(component, "widget__header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("overwrites tagname and role with bem_element", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return (
            <header
                className="no-overwrite"
                role="title"
                bem_element="caption"
              />
          );
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__caption", "header");
      assert.bem_not_exists(component, "widget__header");
      assert.bem_not_exists(component, "widget__title");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates (B)lock, Block (M)odifier, and (E)lement", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"],
          bem_block_modifiers: ["christmas"]
        };

        render() {
          return <header className="no-overwrite" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget--christmas__header", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates (B)lock, (E)lement, and Element (M)odifier", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header className="no-overwrite" modifiers="blinking" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget__header--blinking", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates (B)lock, Block (M)odifier, (E)lement, and Element (M)odifier", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"],
          bem_block_modifiers: ["christmas"]
        };

        render() {
          return <header className="no-overwrite" modifiers="blinking" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget--christmas__header", "header");
      assert.bem_exists(component, "widget__header--blinking", "header");
      assert.bem_exists(component, "widget--christmas__header--blinking", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("Should formulate multiple Blocks", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget", "slider"]
        };

        render() {
          return <header className="no-overwrite" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "slider__header", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates multiple Block Modifiers", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"],
          bem_block_modifiers: ["christmas", "thanksgiving"]
        };

        render() {
          return <header className="no-overwrite" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget--christmas__header", "header");
      assert.bem_exists(component, "widget--thanksgiving__header", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates multiple Element Modifiers", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return <header className="no-overwrite" modifiers="blinking highlight" />;
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget__header--blinking", "header");
      assert.bem_exists(component, "widget__header--highlight", "header");
      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates multiple Blocks, Block Modifiers, and Element Modifiers", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget", "slider"],
          bem_block_modifiers: ["christmas", "thanksgiving"]
        };

        render() {
          return <header className="no-overwrite" modifiers="blinking highlight" />;
        }
      }

      let component = connect(SimpleComponent);

      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget--christmas__header", "header");
      assert.bem_exists(component, "widget--thanksgiving__header", "header");
      assert.bem_exists(component, "widget__header--blinking", "header");
      assert.bem_exists(component, "widget__header--highlight", "header");
      assert.bem_exists(component, "widget--christmas__header--blinking", "header");
      assert.bem_exists(component, "widget--christmas__header--highlight", "header");
      assert.bem_exists(component, "widget--thanksgiving__header--blinking", "header");
      assert.bem_exists(component, "widget--thanksgiving__header--highlight", "header");
      assert.bem_exists(component, "widget__header", "header");

      assert.bem_exists(component, "slider--christmas__header", "header");
      assert.bem_exists(component, "slider--thanksgiving__header", "header");
      assert.bem_exists(component, "slider__header--blinking", "header");
      assert.bem_exists(component, "slider__header--highlight", "header");
      assert.bem_exists(component, "slider--christmas__header--blinking", "header");
      assert.bem_exists(component, "slider--christmas__header--highlight", "header");
      assert.bem_exists(component, "slider--thanksgiving__header--blinking", "header");
      assert.bem_exists(component, "slider--thanksgiving__header--highlight", "header");

      assert.bem_exists(component, "no-overwrite", "header");
    });

    it("formulates multiple Blocks, Block Modifiers, and Element Modifiers with proper element name", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget", "slider"],
          bem_block_modifiers: ["christmas", "thanksgiving"]
        };

        render() {
          return <header className="no-overwrite" modifiers="blinking highlight" role="title" bem_element="caption" />;
        }
      }

      let component = connect(SimpleComponent);

      assert.bem_exists(component, "widget__caption", "header");
      assert.bem_exists(component, "widget--christmas__caption", "header");
      assert.bem_exists(component, "widget--thanksgiving__caption", "header");
      assert.bem_exists(component, "widget__caption--blinking", "header");
      assert.bem_exists(component, "widget__caption--highlight", "header");
      assert.bem_exists(component, "widget--christmas__caption--blinking", "header");
      assert.bem_exists(component, "widget--christmas__caption--highlight", "header");
      assert.bem_exists(component, "widget--thanksgiving__caption--blinking", "header");
      assert.bem_exists(component, "widget--thanksgiving__caption--highlight", "header");
      assert.bem_exists(component, "widget__caption", "header");

      assert.bem_exists(component, "slider--christmas__caption", "header");
      assert.bem_exists(component, "slider--thanksgiving__caption", "header");
      assert.bem_exists(component, "slider__caption--blinking", "header");
      assert.bem_exists(component, "slider__caption--highlight", "header");
      assert.bem_exists(component, "slider--christmas__caption--blinking", "header");
      assert.bem_exists(component, "slider--christmas__caption--highlight", "header");
      assert.bem_exists(component, "slider--thanksgiving__caption--blinking", "header");
      assert.bem_exists(component, "slider--thanksgiving__caption--highlight", "header");

      assert.bem_exists(component, "no-overwrite", "header");
    });
  });

  describe("Nested Element BEM Formation", function() {
    it("nests (B)lock and (E)lement", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return (
            <header>
              <h1><span>HEADER:</span> This is the Header</h1>
            </header>
          );
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__header", "header");
      assert.bem_exists(component, "widget__h1", "h1");
      assert.bem_exists(component, "widget__span", "span");
    });

    it("nests element name", function() {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"]
        };

        render() {
          return (
            <header role="leader" bem_element="caption">
              <h1 role="title"><span>HEADER:</span> This is the Header</h1>
            </header>
          );
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__caption", "header");
      assert.bem_exists(component, "widget__title", "h1");
      assert.bem_exists(component, "widget__span", "span");
    });

    it("nests multiple blocks, block modifiers, and element modifiers", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget", "slider"]
        };

        render() {
          return (
            <header role="leader" bem_element="caption">
              <h1 role="title" modifiers="blinking highlight"><span>HEADER:</span> This is the Header</h1>
            </header>
          );
        }
      }

      let component = connect(SimpleComponent);
      assert.bem_exists(component, "widget__caption", "header");
      assert.bem_exists(component, "slider__caption", "header");
      assert.bem_exists(component, "widget__title", "h1");
      assert.bem_exists(component, "widget__title--blinking", "h1");
      assert.bem_exists(component, "slider__title", "h1");
      assert.bem_exists(component, "slider__title--blinking", "h1");
      assert.bem_exists(component, "widget__span", "span");
      assert.bem_exists(component, "slider__span", "span");
    });
  });

  describe("Translation", function() {
    it("translates class name", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget", "slider"]
        };

        bem_translate_class(bem_classes) {
          return bem_classes.split(" ").map(function(class_name) {
            return "translated-" + class_name;
          }).join(" ");
        };

        render() {
          return <header className="no-overwrite" />;
        };
      }

      let component = connect(SimpleComponent);
      assert.bem_not_exists(component, "widget__header", "header");
      assert.bem_not_exists(component, "slider__header", "header");
      assert.bem_exists(component, "translated-widget__header", "header");
      assert.bem_exists(component, "translated-slider__header", "header");
      assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });
  });

  describe("Order", function() {
    it("orders classnames properly for overrides", () => {
      @withBEM()
      class SimpleComponent extends Component {
        static defaultProps = {
          bem_blocks: ["widget"],
          bem_block_modifiers: ["christmas"]
        };

        render() {
          return <header modifiers="blinking" />;
        }
      }

      let component = connect(SimpleComponent),
          els = TestUtils.scryRenderedDOMComponentsWithTag(component, "header"),
          header = ReactDOM.findDOMNode(component),
          classList = header.classList;

      assert.equal(classList.length, 4);
      assert.equal(classList[0], "widget__header");
      assert.equal(classList[1], "widget__header--blinking");
      assert.equal(classList[2], "widget--christmas__header");
      assert.equal(classList[3], "widget--christmas__header--blinking");
    });
  });
});
