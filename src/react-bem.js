var BEMTransformer = function() {
  this.get_child_modifiers = function(child) {
    if (typeof child === "string" || !child.props.modifiers) return [];
    return child.props.modifiers.split(" ");
  };

  this.get_child_bem_element = function(child) {
    if (typeof child.props.bem_element !== "string") return null;
    return child.props.bem_element;
  };

  this.get_child_tag_name = function(child) {
    var name = (typeof child.type === "string")
        ? child.type
        : child.type.displayName;

    return name.toLowerCase().replace("reactdom", "");
  };

  this.get_child_bem_role = function(child) {
    if (typeof child.props.role !== "string") return null;
    return child.props.role;
  };

  this.get_child_element = function(child) {
    if (typeof child === "string") return child;
    return this.get_child_bem_element(child)
        || this.get_child_bem_role(child)
        || this.get_child_tag_name(child)
        || "";
  };

  this.build_bem_class = function(child, blocks, block_modifiers, translate) {
    var B = blocks,
        BM = block_modifiers,
        E = this.get_child_element(child),
        EM = this.get_child_modifiers(child);

    var classes = [];
    for (var b in B) {
      b = B[b];

      classes.push(b + "__" + E);

      for (var em in EM) {
        em = EM[em];
        classes.push(b + "__" + E + "--" + em);
      }

      for (var bm in BM) {
        bm = BM[bm];

        classes.push(b + "--" + bm + "__" + E);
        for (var em in EM) {
          em = EM[em];
          classes.push(b + "--" + bm + "__" + E + "--" + em);
        }
      }
    }

    var bem_classes = classes.join(" ");
    return (typeof translate === "function")
        ? translate(bem_classes)
        : bem_classes;
  };

  this.transform_props = function(props, blocks, block_modifiers, translate) {
    var changes = {};

    if (typeof props.children === "object") {
      var children = React.Children.toArray(props.children),

      transformed_children = children.map(function (child) {
        return this.transform(child, blocks, block_modifiers, translate);
      }.bind(this)),

      is_untransformed = function (transformed, i) {
        return transformed !== children[i];
      };

      if (transformed_children.some(is_untransformed)) {
        changes.children = transformed_children;
      }
    }

    for (var key in Object.keys(props)) {
      if (key === "children") continue;

      var child = props[key];
      if (!React.isValidElement(child)) continue;

      var new_child = this.transform(child, blocks, block_modifiers, translate);
      if (new_child === child) continue;
      changes[key] = new_child;
    }

    return changes;
  };

  this.transform = function(element, blocks, block_modifiers, translate) {
    if (typeof element !== "object") return element;

    var changes =
        this.transform_props(element.props, blocks, block_modifiers, translate);

    var suffix_classes = element.props.className
        ? element.props.className
        : "";

    changes.className = ""
        + this.build_bem_class(element, blocks, block_modifiers, translate)
        + " "
        + suffix_classes;

    var children = changes.children || element.props.children;
    return (Object.keys(changes).length === 0)
        ? element
        : React.cloneElement(element, changes, children);
  }.bind(this);
};

var transformer = new BEMTransformer();

ReactBEM = {
  getInitialState: function() {
    this.bem_blocks = this.bem_blocks || [];
    this.bem_block_modifiers = this.bem_block_modifiers || [];
    return null;
  },

  render: function() {
    return transformer.transform(
        this.bem_render(),
        this.bem_blocks,
        this.bem_block_modifiers,
        this.bem_translate_class
      );
  }
};
