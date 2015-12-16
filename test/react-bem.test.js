describe("Completer Integration Tests", function() {

  var TestUtils = React.addons.TestUtils;

  var connect = function(Component) {
    return TestUtils.renderIntoDocument(React.createElement(Component));
  };

  var unmount_component = function(component) {
    React.unmountComponentAtNode(component.getDOMNode().parent);
  };

  chai.assert.bem_exists = function(component, bem_class_name, tag_name) {
    var el = TestUtils.findRenderedDOMComponentWithClass(
        component,
        bem_class_name
      );

    chai.assert.equal(el.type.displayName, tag_name);
  };

  chai.assert.bem_not_exists = function(component, bem_class_name) {
    var els = TestUtils.scryRenderedDOMComponentsWithClass(
        component,
        bem_class_name
      );
    chai.assert.equal(els.length, 0);
  };

  describe("Single Element BEM Formation Tests", function() {
    it("Should formulate (B)lock and (E)lement", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header(null);
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      unmount_component(component);
    });

    it("Should not modify existing classes", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({className: "no-overwrite"});
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should overwrite tagname with role", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            role: "title"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__title", "header");
      chai.assert.bem_not_exists(component, "widget__header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("should overwrite tagname with bem_element", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            bem_element: "caption"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__caption", "header");
      chai.assert.bem_not_exists(component, "widget__header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should overwrite tagname and role with bem_element", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            role: "title",
            bem_element: "caption"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__caption", "header");
      chai.assert.bem_not_exists(component, "widget__header");
      chai.assert.bem_not_exists(component, "widget__title");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate (B)lock, Block (M)odifier, and (E)lement", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],
        bem_block_modifiers: ["christmas"],

        bem_render: function() {
          return React.DOM.header({className: "no-overwrite"});
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget--christmas__header", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate (B)lock, (E)lement, and Element (M)odifier", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            modifiers: "blinking"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget__header--blinking", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate (B)lock, Block (M)odifier, (E)lement, and Element (M)odifier", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],
        bem_block_modifiers: ["christmas"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            modifiers: "blinking"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget--christmas__header", "header");
      chai.assert.bem_exists(component, "widget__header--blinking", "header");
      chai.assert.bem_exists(component, "widget--christmas__header--blinking", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate multiple Blocks", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget", "slider"],

        bem_render: function() {
          return React.DOM.header({className: "no-overwrite"});
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "slider__header", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate multiple Block Modifiers", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],
        bem_block_modifiers: ["christmas", "thanksgiving"],

        bem_render: function() {
          return React.DOM.header({className: "no-overwrite"});
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget--christmas__header", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__header", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate multiple Element Modifiers", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            modifiers: "blinking highlight"
          });
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget__header--blinking", "header");
      chai.assert.bem_exists(component, "widget__header--highlight", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });

    it("Should formulate multiple Blocks, Block Modifiers, and Element Modifiers", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget", "slider"],
        bem_block_modifiers: ["christmas", "thanksgiving"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            modifiers: "blinking highlight"
          });
        }
      });

      var component = connect(SimpleComponent);

      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget--christmas__header", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__header", "header");
      chai.assert.bem_exists(component, "widget__header--blinking", "header");
      chai.assert.bem_exists(component, "widget__header--highlight", "header");
      chai.assert.bem_exists(component, "widget--christmas__header--blinking", "header");
      chai.assert.bem_exists(component, "widget--christmas__header--highlight", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__header--blinking", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__header--highlight", "header");
      chai.assert.bem_exists(component, "widget__header", "header");

      chai.assert.bem_exists(component, "slider--christmas__header", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__header", "header");
      chai.assert.bem_exists(component, "slider__header--blinking", "header");
      chai.assert.bem_exists(component, "slider__header--highlight", "header");
      chai.assert.bem_exists(component, "slider--christmas__header--blinking", "header");
      chai.assert.bem_exists(component, "slider--christmas__header--highlight", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__header--blinking", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__header--highlight", "header");

      chai.assert.bem_exists(component, "no-overwrite", "header");

      unmount_component(component);
    });

    it("Should formulate multiple Blocks, Block Modifiers, and Element Modifiers with proper element name", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget", "slider"],
        bem_block_modifiers: ["christmas", "thanksgiving"],

        bem_render: function() {
          return React.DOM.header({
            className: "no-overwrite",
            modifiers: "blinking highlight",
            role: "title",
            bem_element: "caption"
          });
        }
      });

      var component = connect(SimpleComponent);

      chai.assert.bem_exists(component, "widget__caption", "header");
      chai.assert.bem_exists(component, "widget--christmas__caption", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__caption", "header");
      chai.assert.bem_exists(component, "widget__caption--blinking", "header");
      chai.assert.bem_exists(component, "widget__caption--highlight", "header");
      chai.assert.bem_exists(component, "widget--christmas__caption--blinking", "header");
      chai.assert.bem_exists(component, "widget--christmas__caption--highlight", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__caption--blinking", "header");
      chai.assert.bem_exists(component, "widget--thanksgiving__caption--highlight", "header");
      chai.assert.bem_exists(component, "widget__caption", "header");

      chai.assert.bem_exists(component, "slider--christmas__caption", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__caption", "header");
      chai.assert.bem_exists(component, "slider__caption--blinking", "header");
      chai.assert.bem_exists(component, "slider__caption--highlight", "header");
      chai.assert.bem_exists(component, "slider--christmas__caption--blinking", "header");
      chai.assert.bem_exists(component, "slider--christmas__caption--highlight", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__caption--blinking", "header");
      chai.assert.bem_exists(component, "slider--thanksgiving__caption--highlight", "header");

      chai.assert.bem_exists(component, "no-overwrite", "header");

      unmount_component(component);
    });
  });

  describe("Nested Element BEM Formation Tests", function() {
    it("Should nest (B)lock and (E)lement", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header(null,
            React.DOM.h1(null,
              React.DOM.span(null,
                "HEADER:"
              ),
              " This is the Header"
            )
          );
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__header", "header");
      chai.assert.bem_exists(component, "widget__h1", "h1");
      chai.assert.bem_exists(component, "widget__span", "span");
      unmount_component(component);
    });

    it("Should properly nest element name", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],

        bem_render: function() {
          return React.DOM.header({role: "leader", bem_element: "caption"},
            React.DOM.h1({role: "title"},
              React.DOM.span(null,
                "HEADER:"
              ),
              " This is the Header"
            )
          );
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__caption", "header");
      chai.assert.bem_exists(component, "widget__title", "h1");
      chai.assert.bem_exists(component, "widget__span", "span");
      unmount_component(component);
    });

    it("Should nest multiple blocks, block modifiers, and element modifiers", function() {
      var SimpleComponent = React.createClass({
          mixins: [ReactBEM],

          bem_blocks: ["widget", "slider"],

          bem_render: function() {
            return React.DOM.header({role: "leader", bem_element: "caption"},
              React.DOM.h1({role: "title", modifiers: "blinking highlight"},
                React.DOM.span(null,
                  "HEADER:"
                ),
                " This is the Header"
              )
            );
          }
        });

      var component = connect(SimpleComponent);
      chai.assert.bem_exists(component, "widget__caption", "header");
      chai.assert.bem_exists(component, "slider__caption", "header");
      chai.assert.bem_exists(component, "widget__title", "h1");
      chai.assert.bem_exists(component, "widget__title--blinking", "h1");
      chai.assert.bem_exists(component, "slider__title", "h1");
      chai.assert.bem_exists(component, "slider__title--blinking", "h1");
      chai.assert.bem_exists(component, "widget__span", "span");
      chai.assert.bem_exists(component, "slider__span", "span");
      unmount_component(component);
    });
  });

  describe("Translation Tests", function() {
    it("Should translate class name", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget", "slider"],

        bem_translate_class: function(bem_classes) {
          return bem_classes.split(" ").map(function(class_name) {
            return "translated-" + class_name;
          }).join(" ");
        },

        bem_render: function() {
          return React.DOM.header({className: "no-overwrite"});
        }
      });

      var component = connect(SimpleComponent);
      chai.assert.bem_not_exists(component, "widget__header", "header");
      chai.assert.bem_not_exists(component, "slider__header", "header");
      chai.assert.bem_exists(component, "translated-widget__header", "header");
      chai.assert.bem_exists(component, "translated-slider__header", "header");
      chai.assert.bem_exists(component, "no-overwrite", "header");
      unmount_component(component);
    });
  });

  describe("Order Tests", function() {
    it("Should order classes properly for overrides to work", function() {
      var SimpleComponent = React.createClass({
        mixins: [ReactBEM],

        bem_blocks: ["widget"],
        bem_block_modifiers: ["christmas"],

        bem_render: function() {
          return React.DOM.header({
            modifiers: "blinking"
          });
        }
      });

      var component = connect(SimpleComponent),
          els = TestUtils.scryRenderedDOMComponentsWithTag(component, "header"),
          header = ReactDOM.getDOMNode(els[0]),
          classList = header.classList;

      chai.assert.equal(header.classList.length, 4);
      chai.assert.equal(header.classList[0], "widget__header");
      chai.assert.equal(header.classList[1], "widget__header--blinking");
      chai.assert.equal(header.classList[2], "widget--christmas__header");
      chai.assert.equal(header.classList[3], "widget--christmas__header--blinking");

      unmount_component(component);
    });
  });
});

