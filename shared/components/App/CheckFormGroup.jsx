import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import FormGroup from 'shared/components/Form/FormGroup';
import * as appActions from 'shared/actions/app';

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
  actionQuery: PropTypes.instanceOf(Map),
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
  const myComponent = myProps.component;
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

  if (myComponent) {
    return myComponent(myProps, data, actionQuery);
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
