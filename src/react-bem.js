var BEMTransformer = function() {
  this.get_child_modifiers = function(child) {
    if (typeof child.props.modifiers !== "string") return [];
    return child.props.modifiers.split(" ");
  };

  this.get_child_bem_element = function(child) {
    if (typeof child.props.bem_element !== "string") return null;
    return child.props.bem_element;
  };

  this.get_tag_name = function(child) {
    return child.type.displayName.toLowerCase().replace("reactdom", "");
  };

  this.get_child_bem_role = function(child) {
    if (typeof child.props.role !== "string") return null;
    return child.props.role;
  };

  this.get_child_element = function(child) {
    return this.get_child_bem_role(child)
        || this.get_child_bem_element(child)
        || this.get_tag_name(child);
  };

  this.build_bem_class = function(child, blocks, block_modifiers, translate) {
    var B = blocks,
        BM = block_modifiers,
        E = this.get_child_element(child),
        EM = this.get_child_modifiers(child);

    var classes = [];
    for (var b in B) {
      b = B[b];
      for (var bm in BM) {
        bm = BM[bm];
        for (var em in EM) {
          em = EM[em];
          classes.push(b + "--" + bm + "__" + E + "--" + em);
        }
        classes.push(b + "--" + bm + "__" + E);
      }
      for (var em in EM) {
        em = EM[em];
        classes.push(b + "__" + E + "--" + em);
      }
      classes.push(b + "__" + E);
    }

    var bem_classes = classes.join(" ");
    return (typeof translate === "function")
        ? translate(bem_classes)
        : bem_classes;
  };

  this.transform_child = function(child, blocks, block_modifiers, translate) {
    var bem_class = this.build_bem_class(
        child,
        blocks,
        block_modifiers,
        translate
      );

    if (bem_class) {
      child.props.className = child.props.className
          ? child.props.className + " " + bem_class
          : bem_class;
    }

    var children = child.props.children;
    if (typeof children !== "object") return;

    if (children.__proto__.tagName) {
      this.transform_child(children, blocks, block_modifiers, translate);
    }

    if (typeof children.props === "object") {
      children = children.props.children;
    }

    React.Children.forEach(children, function(child) {
      if (!child.type.displayName) return;
      this.transform_child(child, blocks, block_modifiers, translate);
    }.bind(this));
  };

  this.transform = function(root, blocks, block_modifiers, translate) {
    this.transform_child(root, blocks, block_modifiers, translate);
    return root;
  };
};

var transformer = new BEMTransformer();

var ReactBEM = {
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
