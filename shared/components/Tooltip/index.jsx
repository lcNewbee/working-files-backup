import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import TooltipFun from 'tooltip.js';

import './_index.scss';

const propTypes = {
  children: PropTypes.node,
  placement: PropTypes.string,
  title: PropTypes.string,
};

const defaultProps = {
  placement: 'bottom',
};

export class Tooltip extends Component {
  componentDidMount() {
    const referenceElement = ReactDom.findDOMNode(this.elem);
    this.tooltip = new TooltipFun(referenceElement, {
      placement: this.props.placement,
      title: this.props.title,
    });
  }
  componentWillUnmount() {
    if (this.tooltip && typeof this.tooltip === 'function') {
      this.tooltip.destroy();
    }
  }

  render() {
    const { children } = this.props;
    const childrenElem = React.Children.only(children);

    return childrenElem ? (
      <childrenElem.type
        {...childrenElem.props}
        ref={(elem) => {
          if (elem) {
            this.elem = elem;
          }
        }}
      />
    ) : null;
  }
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
