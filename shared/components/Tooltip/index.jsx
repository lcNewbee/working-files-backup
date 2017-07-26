import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RcTooltip from 'rc-tooltip';

import './_index.scss';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

const defaultProps = {
  prefixCls: 'rw-tooltip',
  placement: 'top',
  transitionName: 'rw-tooltip-zoom',
};

export class Tooltip extends Component {
  componentDidMount() {
    // const referenceElement = ReactDom.findDOMNode(this.elem);
    // this.tooltip = new TooltipFun(referenceElement, {
    //   placement: this.props.placement,
    //   title: this.props.title,
    // });
  }
  componentWillUnmount() {
    if (this.tooltip && typeof this.tooltip === 'function') {
      // this.tooltip.destroy();
    }
  }

  render() {
    return (
      <RcTooltip
        {...this.props}
        overlay={<span>{this.props.title}</span>}
      >
        { this.props.children }
      </RcTooltip>
    );
  }
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
