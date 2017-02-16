import React, { PropTypes } from 'react';
import utils from 'utils';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormGroup from '../Form/FormGroup';
import SaveButton from '../Button/SaveButton';
import Table from '../Table/';

const propTypes = {
  id: PropTypes.string,
  action: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['default', 'flow', 'block']),
  size: PropTypes.oneOf(['md', 'compassed']),
  component: PropTypes.oneOf(['form', 'div']),

  hasSaveButton: PropTypes.bool,
  isSaving: PropTypes.bool,
  header: PropTypes.node,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,

  // 数据验证相关
  invalidMsg: PropTypes.instanceOf(Map),
  validateAt: PropTypes.string,
  onChangeData: PropTypes.func,
  onValidError: PropTypes.func,
  onSave: PropTypes.func,

  // f
  options: PropTypes.instanceOf(List),
  data: PropTypes.oneOfType([
    PropTypes.instanceOf(Map), PropTypes.object,
  ]),
  actionQuery: PropTypes.instanceOf(Map),

  hasFile: PropTypes.bool,
  actionable: PropTypes.bool,
  method: PropTypes.oneOf(['POST', 'GET']),
};
const defaultProps = {
  hasSaveButton: false,
  method: 'POST',
  component: 'div',
  actionable: true,
  hasFile: false,
};

class FormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    utils.binds(this, [
      'onSave',
      'onOptionsChange',
      'onChangeFormGoupData',
      'changeFormGoupData',
      'renderFormGroup',
      'renderFormGroupList',
      'renderFormGroupTree',
    ]);
    this.syncData = {};
    this.inited = false;
    this.hasFile = props.hasFile;
  }
  componentWillMount() {
    this.onOptionsChange(this.props);
  }
  componentDidMount() {
    if (!this.inited && Object.keys(this.syncData).length > 0) {
      if (this.props.onChangeData) {
        this.props.onChangeData(this.syncData);
        this.syncData = {};
        this.inited = true;
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.onOptionsChange(nextProps);
    }
  }
  componentDidUpdate() {
    if (!this.inited && Object.keys(this.syncData).length > 0) {
      if (this.props.onChangeData) {
        this.props.onChangeData(this.syncData);
        this.syncData = {};
      }
    }
  }
  onOptionsChange(targetProps) {
    this.options = targetProps.options;

    if (this.options) {
      if (Map.isMap(this.options.get(0))) {
        this.options = this.options
          .groupBy(item => item.get('fieldset'))
          .toList();
      }
    } else {
      this.options = List([]);
    }
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.formElem, this.hasFile);
    }
  }
  onChangeFormGoupData(option) {
    const { data, saveOnChange, valueQuery, linkId } = option;
    let $$upDate = fromJS({});

    // 只有 当
    if (valueQuery.length > 1) {
      $$upDate = fromJS(this.props.data);
    }

    $$upDate = $$upDate.setIn(valueQuery, data.value);

    // 处理同步链接的ID
    if (typeof linkId === 'string') {
      $$upDate = $$upDate.setIn(linkId.split('.'), data.value);
    }

    if (this.props.onChangeData) {
      this.props.onChangeData($$upDate.toJS());
    }

    if (saveOnChange) {
      clearTimeout(this.saveOnChangeTimeout);
      this.saveOnChangeTimeout = setTimeout(() => {
        this.onSave();
      }, 250);
    }
  }
  changeFormGoupData(option) {
    const { data, onBeforeChange, $$data } = option;
    const beforeFuncOption = utils.extend({
      curData: $$data.toJS(),
      curValue: $$data.get(option.id),
    }, data);
    let beforeRusult;

    if (utils.isFunc(onBeforeChange)) {
      beforeRusult = onBeforeChange(beforeFuncOption);
    }

    if (!beforeRusult) {
      this.onChangeFormGoupData(option);
    } else if (utils.isPromise(beforeRusult)) {
      beforeRusult.then(
        (msg) => {
          if (!msg) {
            this.onChangeFormGoupData(option);
          }
        },
      );
    }
  }
  renderFormGroup($$option, valueQuery) {
    const {
      invalidMsg, validateAt, onValidError, actionQuery, id, actionable, formKey,
    } = this.props;
    const myProps = $$option.toJS();
    const index = $$option.get('__index__');
    const myComponent = myProps.component;
    const checkboxValue = myProps.value || '1';
    const linkId = myProps.linkId;
    let formGroupId = myProps.id;
    let myValueQuery = valueQuery;
    let isShow = true;
    let $$data = this.props.data;

    delete myProps.fieldset;
    delete myProps.legend;
    delete myProps.fieldsetOption;

    if (myProps.type === 'file') {
      this.hasFile = true;
    }

    if (id) {
      myProps.form = id;
    }

    if (formGroupId) {
      if (!myValueQuery) {
        myValueQuery = [formGroupId];
      } else {
        formGroupId = myValueQuery.join('.');
      }

      myProps.name = formGroupId;

      myProps.key = `${formGroupId}${index}`;
    }


    // 同时支持 Map 或 object 数据
    // 数据的填充
    if ($$data) {
      if (!Map.isMap($$data)) {
        $$data = fromJS($$data);
      }

      // 正常获取值
      if ($$data.getIn(myValueQuery) !== undefined) {
        myProps.value = $$data.getIn(myValueQuery);
      }

      // 有特殊初始化函数 initValue，只执行一次
      if (typeof myProps.initValue === 'function' && !this.inited) {
        myProps.value = myProps.initValue($$data);

        if (myProps.value !== $$data.get(formGroupId)) {
          this.syncData[formGroupId] = myProps.value;
        }
      }
    }

    // 数据验证相关属性
    if (invalidMsg && typeof invalidMsg.get === 'function') {
      myProps.errMsg = invalidMsg.get(formGroupId);
    }

    if (validateAt) {
      myProps.validateAt = validateAt;
    }

    if (onValidError) {
      myProps.onValidError = onValidError;
    }

    // checkbox 的 value要特殊处理
    if (myProps.type === 'checkbox') {
      myProps.value = checkboxValue;
      myProps.id = formGroupId;
      myProps.checked = $$data.getIn(myValueQuery) === checkboxValue ||
        parseInt($$data.getIn(myValueQuery), 10) === parseInt(checkboxValue, 10);
    }

    // change
    myProps.onChange = myData => this.changeFormGoupData({
      id: formGroupId,
      data: myData,
      onBeforeChange: myProps.onBeforeChange,
      saveOnChange: myProps.saveOnChange,
      valueQuery: myValueQuery,
      $$data,
      linkId,
    });

    // 处理 option需要依据表单值显示
    if (typeof myProps.options === 'function') {
      myProps.options = myProps.options($$data);
    }

    // 处理异步加载 loadOptions 需要依据现有数据初始化
    if (typeof myProps.loadOptions === 'function') {
      myProps.loadOptions = myProps.loadOptions($$data);
    }

    // 处理显示前提条件
    if (typeof myProps.showPrecondition === 'function') {
      isShow = myProps.showPrecondition($$data);
    }

    // 如果是不可操作的
    if (!actionable) {
      myProps.disabled = true;
    }

    if (myComponent) {
      return myComponent(myProps, $$data, actionQuery);
    }

    return isShow ? (
      <FormGroup
        {...myProps}
      />
    ) : null;
  }
  renderFormGroupList($$option) {
    let $$data = this.props.data;
    const formGroupListId = $$option.get('id');
    let $$optionsList = $$option.get('list');
    let ret = null;

    if ($$data) {
      if (!Map.isMap($$data)) {
        $$data = fromJS($$data);
      }
    }

    if ($$data.get(formGroupListId)) {
      $$optionsList = $$optionsList.map(
        ($$item) => {
          let retNode = $$item;

          if (!$$item.get('noForm')) {
            retNode = $$item.set(
              'transform',
              (val, $$listData, index) => this.renderFormGroup(
                $$item.merge({
                  __index__: index,
                  showLabel: false,
                  display: 'block',
                }),
                [formGroupListId, index, $$item.get('id')],
              ),
            );
          }
          return retNode;
        },
      );

      ret = (
        <Table
          options={$$optionsList}
          list={$$data.get(formGroupListId)}
        />
      );
    }
    // if ($$data.get(formGroupListId)) {
    //   ret = $$data.get(formGroupListId).map(
    //     ($$item, index) => $$optionsList.map(
    //       ($$subItem, i) => this.renderFormGroup(
    //         $$subItem.set('__index__', i),
    //         [formGroupListId, index, $$subItem.get('id')],
    //       ),
    //     ),
    //   );
    // }

    return ret;
  }
  renderFormGroupTree($$options, i) {
    let ret = null;

    // Map直接渲染FormGroup
    if (Map.isMap($$options)) {
      // 如果不是列表
      if ($$options.get('type') !== 'list') {
        ret = this.renderFormGroup(
          $$options.set('__index__', i),
        );
      } else {
        ret = this.renderFormGroupList(
          $$options.set('__index__', i),
        );
      }

    // List 则需要循环渲染
    } else if (List.isList($$options)) {
      ret = $$options.map(($$item, index) => {
        const $$fieldsetOption = $$item.getIn([0, 'fieldsetOption']);
        const fieldsetKey = `${$$item.getIn([0, 'fieldset'])}Fileset`;
        let fieldsetClassName = 'o-form__fieldset';
        let legendText = $$item.getIn([0, 'legend']);


        if ($$fieldsetOption) {
          legendText = legendText || $$fieldsetOption.get('legend');
          if ($$fieldsetOption.get('className')) {
            fieldsetClassName = `${fieldsetClassName} ${$$fieldsetOption.get('className')}`;
          }
        }

        // 如果是带有标题 List，需添加legend
        if (legendText) {
          return (
            <fieldset
              key={fieldsetKey}
              className={fieldsetClassName}
            >
              <legend className="o-form__legend">{legendText}</legend>
              {
                this.renderFormGroupTree($$item, index)
              }
            </fieldset>
          );
        }

        // 如果是无标题 List
        return this.renderFormGroupTree($$item, index);
      });
    }

    return ret;
  }
  render() {
    const {
      isSaving, action, hasSaveButton, layout, size,
      className, hasFile, method, leftChildren, rightChildren,
      component,
    } = this.props;
    let Component = component;
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
      Component = 'form';
      this.hasFile = true;
    }

    if (Component === 'form') {
      formProps = {
        action,
        method,
        encType,
      };
    }

    return (
      <Component
        {...formProps}
        className={classNames}
        id={this.props.id}
        ref={(elem) => {
          if (elem) {
            this.formElem = elem;
          }
        }}
      >
        {
          this.props.header
        }
        <div className="o-form__body">
          {
            leftChildren && leftChildren.length > 0 ? (
              <div className="form-group fl">
                { leftChildren }
              </div>
            ) : null
          }
          { this.renderFormGroupTree(this.options) }
          {
            rightChildren && rightChildren.length > 0 ? (
              <div className="form-group fr">
                { rightChildren }
              </div>
            ) : null
          }
        </div>
        <div className="o-form__footer">
          {
            hasSaveButton ? (
              <div className="form-group form-group--save">
                <div className="form-control">
                  <SaveButton
                    type="button"
                    loading={isSaving}
                    disabled={!this.props.actionable}
                    onClick={this.onSave}
                  />
                </div>
              </div>
            ) : null
          }
        </div>
      </Component>
    );
  }
}
FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default FormContainer;
