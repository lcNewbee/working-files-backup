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
  action: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['flow', 'block']),
  size: PropTypes.oneOf(['compassed']),

  hasSaveButton: PropTypes.bool,
  isSaving: PropTypes.bool,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,

  // 数据验证相关
  validateAt: PropTypes.number,
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
      invalidMsg, validateAt, onValidError, actionQuery,
    } = this.props;
    const myProps = option.toJS();
    const id = myProps.id;
    const myComponent = myProps.component;
    const checkboxValue = myProps.checkedValue || '1';
    let data = this.props.data;

    delete myProps.fieldset;
    delete myProps.legend;
    delete myProps.id;

    myProps.name = id;
    myProps.key = id;

    if (invalidMsg && typeof invalidMsg.get === 'function') {
      myProps.errMsg = invalidMsg.get(id);
    }

    // 同时支持 Map 或 object 数据
    if (data) {
      if (!Map.isMap(data)) {
        data = fromJS(data);
      }
      myProps.value = data.get(id);
    }

    myProps.validateAt = validateAt;
    myProps.onChange = myData => this.onChangeData(id, myData);
    myProps.onValidError = onValidError;

    if (myComponent) {
      return myComponent(myProps, data, actionQuery);
    }

    if (myProps.type === 'checkbox') {
      myProps.checked = checkboxValue === myProps.value;
      myProps.value = checkboxValue;
    }

    if (myProps.saveOnChange) {
      myProps.onChange = (myData => {
        this.onChangeData(id, myData);
        this.onSave();
      });
    }

    return (
      <FormGroup
        {...myProps}
      />
    );
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
    } = this.props;
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

    return (
      <form
        className={classNames}
        action={action}
        method={method}
        encType={encType}
      >
      {
        leftChildren && leftChildren.length > 0 ? (
          <div className="form-group ss">
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
      </form>
    );
  }
}
FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default FormContainer;
