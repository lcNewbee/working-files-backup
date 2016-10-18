import React, { PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const propTypes = {
  id: PropTypes.string,
  action: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['flow', 'block']),
  size: PropTypes.oneOf(['compassed']),
  componentType: PropTypes.oneOf(['form', 'div']),

  hasSaveButton: PropTypes.bool,
  isSaving: PropTypes.bool,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,

  // 数据验证相关
  validateAt: PropTypes.string,
  onChangeData: PropTypes.func,
  onValidError: PropTypes.func,
  onSave: PropTypes.func,
  options: PropTypes.instanceOf(List),
  data: PropTypes.oneOfType([
    PropTypes.instanceOf(Map), PropTypes.object,
  ]),
  actionQuery: PropTypes.instanceOf(Map),
  invalidMsg: PropTypes.instanceOf(Map),

  hasFile: PropTypes.bool,
  method: PropTypes.oneOf(['POST', 'GET']),
};
const defaultProps = {
  hasSaveButton: false,
  method: 'POST',
  componentType: 'div',
};

class FormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.renderFormGroup = this.renderFormGroup.bind(this);
    this.renderFormGroupTree = this.renderFormGroupTree.bind(this);
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
  onChangeData(id, data) {
    const upDate = {};

    upDate[id] = data.value;
    if (this.props.onChangeData) {
      this.props.onChangeData(upDate);
    }
  }
  renderFormGroup(option) {
    const {
      invalidMsg, validateAt, onValidError, actionQuery, id,
    } = this.props;
    const myProps = option.toJS();
    const groupId = myProps.id;
    const myComponent = myProps.component;
    const checkboxValue = myProps.checkedValue || '1';
    let isShow = true;
    let data = this.props.data;

    delete myProps.fieldset;
    delete myProps.legend;
    delete myProps.id;

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

    if (myComponent) {
      return myComponent(myProps, data, actionQuery);
    }

    if (myProps.type === 'checkbox') {
      myProps.checked = checkboxValue === myProps.value;
      myProps.value = checkboxValue;
    }

    if (myProps.saveOnChange) {
      myProps.onChange = ((myData) => {
        this.onChangeData(groupId, myData);
        this.onSave();
      });
    }

    // 处理显示前提条件
    if (typeof myProps.showPrecondition === 'function') {
      isShow = myProps.showPrecondition(data);
    }

    return isShow ? (
      <FormGroup
        {...myProps}
      />
    ) : null;
  }
  renderFormGroupTree(options) {
    // Map直接渲染FormGroup
    if (Map.isMap(options)) {
      return this.renderFormGroup(options);
    }

    // List 则需要循环渲染
    if (List.isList(options)) {
      return options.map((item, index) => {
        const legendText = item.getIn([0, 'legend']);

        // 如果是带有标题 List，需添加legend
        if (legendText) {
          return (
            <fieldset key={index} className="o-form__fieldset">
              <legend className="o-form__legend">{legendText}</legend>
              {
                this.renderFormGroupTree(item)
              }
            </fieldset>
          );
        }

        // 如果是无标题 List
        return this.renderFormGroupTree(item);
      });
    }

    return null;
  }
  render() {
    const {
      isSaving, action, options, hasSaveButton, layout, size,
      className, hasFile, method, leftChildren, rightChildren,
      componentType,
    } = this.props;
    let formProps = null;
    let classNames = 'o-form';
    let encType = 'application/x-www-form-urlencoded';

    if (layout) {
      classNames = `${classNames} o-form--${layout}`;
    }

    if (size) {
      classNames = `${classNames} o-form--${size}`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }

    if (hasFile) {
      encType = 'multipart/form-data';
    }

    if (componentType === 'form') {
      formProps = {
        action,
        method,
        encType,
      };
    }

    return (
      <div
        className={classNames}
        id={this.props.id}
        {...formProps}
      >
        {
          leftChildren && leftChildren.length > 0 ? (
            <div className="form-group fl">
              { leftChildren }
            </div>
          ) : null
        }
        { this.renderFormGroupTree(options) }
        {
          rightChildren ? (
            <div className="form-group fr">
              { rightChildren }
            </div>
          ) : null
        }
        {
          hasSaveButton ? (
            <div className="form-group form-group--save">
              <div className="form-control">
                <SaveButton
                  type="button"
                  loading={isSaving}
                  onClick={this.onSave}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}
FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default FormContainer;
