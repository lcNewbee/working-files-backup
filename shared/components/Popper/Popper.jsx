
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RcTooltip from 'rc-tooltip';
import utils from 'shared/utils';

import Button from '../Button/Button';
import Icon from '../Icon';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  type: '',
  onVisibleChange: PropTypes.func,
  visible: PropTypes.bool,
};

const defaultProps = {
  prefixCls: 'rw-tooltip',
  transitionName: 'rw-tooltip-zoom',
  trigger: 'click',
};

export class Popconfirm extends Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onVisibleChange',
      'setVisible',
    ]);
    this.state = {};

    if ('visible' in props) {
      this.state = props.visible;
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  onVisibleChange(visible) {
    this.setVisible(visible);
  }

  setVisible(visible) {
    const props = this.props;

    if (!('visible' in props)) {
      this.setState({ visible });
    }

    const { onVisibleChange } = props;
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }

  render() {
    const { title, ...rest } = this.props;

    const popOverlay = (
      <div className="m-popconfirm">
        <div className="m-popconfirm__content">
          <Icon name="warning" />{title}
        </div>
        <div className="m-popconfirm__footer">
          <Button onClick={this.onOk} theme="primary" text={__('OK')} />
          <Button onClick={this.onCancel} text={__('NO')} />
        </div>
      </div>
    );
    return (
      <RcTooltip
        {...rest}
        onVisibleChange={this.onVisibleChange}
        visible={this.state.visible}
        overlay={popOverlay}
      >
        { this.props.children }
      </RcTooltip>
    );
  }
}

Popconfirm.propTypes = propTypes;
Popconfirm.defaultProps = defaultProps;

export default Popconfirm;
