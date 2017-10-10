
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RcTooltip from 'rc-tooltip';
import utils from 'shared/utils';

import Button from '../Button/Button';
import Icon from '../Icon';
import './Popconfirm.scss';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  content: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onVisibleChange: PropTypes.func,
  visible: PropTypes.bool,
  type: PropTypes.oneOf(['confirm', 'message']),
};

const defaultProps = {
  prefixCls: 'rw-tooltip',
  transitionName: 'rw-tooltip-zoom',
  trigger: 'click',
  type: 'confirm',
};

export class Popconfirm extends Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onOk',
      'onCancel',
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


  onOk(e) {
    this.setVisible(false);

    if (this.props.onOk) {
      this.props.onOk(e);
    }
  }

  onCancel(e) {
    this.setVisible(false);

    if (this.props.onCancel) {
      this.props.onCancel(e);
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
    const { title, type, ...rest } = this.props;

    const popOverlay = (
      <div className="m-popconfirm">
        <div className="m-popconfirm__content">
          <Icon name="warning" />{title}
        </div>
        {
          type === 'confirm' ? (
            <div className="m-popconfirm__footer">
              <Button onClick={this.onOk} theme="primary" text={__('OK')} />
              <Button onClick={this.onCancel} theme="secondary" text={__('NO')} />
            </div>
          ) : null
        }
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
