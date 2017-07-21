import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { actions as appActions } from 'shared/containers/app';
import FormGroup from './FormGroup';

const propTypes = {
  id: PropTypes.string,

  // 数据验证相关
  validateAt: PropTypes.string,
  onValidError: PropTypes.func,
  onFormSave: PropTypes.func,

  // f
  option: PropTypes.instanceOf(Map),
  data: PropTypes.oneOfType([
    PropTypes.instanceOf(Map), PropTypes.object,
  ]),
  invalidMsg: PropTypes.instanceOf(Map),
};

const defaultProps = {
  Component: 'span',
};

function CheckFormGroup(props) {
  const {
    invalidMsg, validateAt, onValidError, id, onFormSave,
  } = props;
  const myProps = props.option.toJS();
  const groupId = myProps.id;
  const render = myProps.render;
  const checkboxValue = myProps.checkedValue || '1';
  let isShow = true;
  let data = props.data;

  delete myProps.fieldset;
  delete myProps.legend;
  // delete myProps.id;

  if (id) {
    myProps.form = id;
  }

  if (groupId) {
    myProps.name = groupId;
    myProps.key = groupId;
  }

  if (invalidMsg && typeof invalidMsg.get === 'function') {
    myProps.errMsg = invalidMsg.get(groupId);
  }

  // 同时支持 Map 或 object 数据
  if (data) {
    if (!Map.isMap(data)) {
      data = fromJS(data);
    }
    myProps.value = data.get(groupId) || '';
  }

  if (validateAt) {
    myProps.validateAt = validateAt;
  }

  if (onValidError) {
    myProps.onValidError = onValidError;
  }

  myProps.onChange = myData => this.onChangeData(groupId, myData);
  if (myProps.saveOnChange) {
    myProps.onChange = ((myData) => {
      this.onChangeData(groupId, myData);
      clearTimeout(this.saveOnChangeTimeout);
      this.saveOnChangeTimeout = setTimeout(() => {
        if (onFormSave) {
          onFormSave();
        }
      }, 250);
    });
  }

  // 处理显示前提条件
  if (typeof myProps.visible === 'function') {
    isShow = myProps.visible(data);
  }

  if (myProps.type === 'checkbox') {
    myProps.checked = checkboxValue === myProps.value;
    myProps.value = checkboxValue;
  }

  if (render) {
    return render(myProps, data, actionQuery);
  }

  return isShow ? (
    <FormGroup
      {...myProps}
    />
  ) : null;
}

CheckFormGroup.propTypes = propTypes;
CheckFormGroup.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    validateAt: PropTypes.string,
    onValidError: PropTypes.func,
    store: state.screens,
  };
}

// 添加 redux 属性的 react 页面
export default connect(
  mapStateToProps,
  appActions,
)(CheckFormGroup);
