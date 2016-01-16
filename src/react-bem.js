import React, { Component, PropTypes } from 'react';

let BEMTransformer = function() {
  this.get_child_modifiers = function(child) {
    if (typeof child === "string" || !child.props.modifiers) return [];
    return child.props.modifiers.split(" ");
  };

  this.get_child_bem_element = function(child) {
    if (typeof child.props.bem_element !== "string") return null;
    return child.props.bem_element;
  };

  this.get_child_tag_name = function(child) {
    let name = (typeof child.type === "string")
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
    let B = blocks,
        BM = block_modifiers,
        E = this.get_child_element(child),
        EM = this.get_child_modifiers(child);

    let classes = [];
    for (let b in B) {
      b = B[b];

      classes.push(b + "__" + E);

      for (let em in EM) {
        em = EM[em];
        classes.push(b + "__" + E + "--" + em);
      }

      for (let bm in BM) {
        bm = BM[bm];

        classes.push(b + "--" + bm + "__" + E);
        for (let em in EM) {
          em = EM[em];
          classes.push(b + "--" + bm + "__" + E + "--" + em);
        }
      }
    }

    let bem_classes = classes.join(" ");
    return (typeof translate === "function")
        ? translate(bem_classes)
        : bem_classes;
  };

  this.transform_props = function(props, blocks, block_modifiers, translate) {
    let changes = {};

    if (typeof props.children === "object") {
      let children = React.Children.toArray(props.children),

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

    for (let key in Object.keys(props)) {
      if (key === "children") continue;

      let child = props[key];
      if (!React.isValidElement(child)) continue;

      let new_child = this.transform(child, blocks, block_modifiers, translate);
      if (new_child === child) continue;
      changes[key] = new_child;
    }

    return changes;
  };

  this.transform = function(element, blocks, block_modifiers, translate) {
    if (typeof element !== "object") return element;

    let changes =
        this.transform_props(element.props, blocks, block_modifiers, translate);

    let suffix_classes = element.props.className
        ? element.props.className
        : "";

    changes.className = ""
        + this.build_bem_class(element, blocks, block_modifiers, translate)
        + " "
        + suffix_classes;

    let children = changes.children || element.props.children;
    return (Object.keys(changes).length === 0)
        ? element
        : React.cloneElement(element, changes, children);
  }.bind(this);
};

let transformer = new BEMTransformer();

export default function withBEM() {
  return (BaseComponent) => {
    const old_render = BaseComponent.prototype.render;

    return class TransformedComponent extends BaseComponent {
      static contextTypes = {
        bem_blocks: PropTypes.arrayOf(PropTypes.string),
        bem_block_modifiers: PropTypes.arrayOf(PropTypes.string)
      };

      render() {
        return (
          transformer.transform(
            old_render.apply(this),
            this.props.bem_blocks,
            this.props.bem_block_modifiers,
            this.bem_translate_class
          )
        );
      }
    };
  };
}
