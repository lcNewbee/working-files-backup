import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from '../../../utils';

const propTypes = {
  isFocus: PropTypes.bool,
};

const defaultProps = {
  type: 'text',
  isFocus: false,
};

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isFocus) {
      this.myRef.focus();
    }
  }
  render() {
    const inputProps = utils.extend({}, this.props);
    let ThisComponent = 'input';

    // 删除多余属性
    delete inputProps.Component;
    delete inputProps.loading;
    delete inputProps.validator;
    delete inputProps.check;
    delete inputProps.checkClear;
    delete inputProps.validateAt;
    delete inputProps.onValidError;
    delete inputProps.isFocus;
    delete inputProps.text;
    delete inputProps.display;
    delete inputProps.inputStyle;
    delete inputProps.onValue;
    delete inputProps.offValue;
    delete inputProps.notEditable;
    delete inputProps.dataType;
    delete inputProps.defaultValue;
    delete inputProps.isLoading;
    delete inputProps.actionName;
    delete inputProps.onRef;
    delete inputProps.linkId;
    delete inputProps.dataFormat;

    if (inputProps.type === 'textarea') {
      ThisComponent = 'textarea';
    }

    // 解决 ie9-11, readOnly情况下还是可以聚焦问题
    if (inputProps.readOnly) {
      inputProps.unselectable = 'on';
    }

    return (
      <ThisComponent
        {...inputProps}
        ref={ref => (this.myRef = ref)}
      />
    );
  }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
