import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';

const customModalOptions = fromJS([
  {
    id: 'model',
    label: __('AP Model'),
    width: '120px',
    type: 'select',
    required: true,
    notEditable: true,
  }, {
    id: 'softVersion',
    label: __('Firmware Version'),
    defaultValue: '',
    type: 'text',
    maxLength: '31',
    required: true,
    notEditable: true,
    validator: validator({
      rules: 'utf8Len:[1, 31]',
    }),
  }, {
    id: 'fileName',
    label: __('Firmware File'),
    defaultValue: '',
    type: 'file',
    required: true,
    accept: '.bin',
    validator: validator({}),
  }, {
    id: 'uploadPath',
    label: __('Firmware File'),
    defaultValue: '',
    noTable: true,
    type: 'hidden',
  }, {
    id: 'active',
    label: __('Active Status'),
    actionName: 'active',
    width: '100px',
    type: 'checkbox',
    value: 1,
  }, {
    id: '__actions__',
    label: __('Actions'),
    width: '100px',
    noForm: true,
  },
]);

const listOptions = fromJS([
  {
    id: 'model',
    label: __('AP Model'),
    width: '120px',
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'softVersion',
    label: __('Firmware Version'),
    defaultValue: '',
    formProps: {
      type: 'text',
      maxLength: '31',
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'fileName',
    label: __('Firmware File'),
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
      accept: '.bin',
      validator: validator({}),
    },
  }, {
    id: 'uploadPath',
    label: __('Firmware File'),
    defaultValue: '',
    noTable: true,
    formProps: {
      type: 'hidden',
    },
  }, {
    id: 'active',
    label: __('Active Status'),
    actionName: 'active',
    width: '100px',
    type: 'switch',
    formProps: {
      value: 1,
    },
  }, {
    id: '__actions__',
    label: __('Actions'),
    width: '100px',
    noForm: true,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  createModal: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  save: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  changeScreenActionQuery: PropTypes.func,
};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'getApModelList',
      'onBeforeAction',
      'onBeforeSave',
      'renderCustomModal',
      'onAddSave',
      'onEditSave',
    ]);
    this.state = {
      updateModel: false,
    };
    this.myEditFormOptions = listOptions.mergeIn(
      [0, 'formProps'], {
        isLoading: true,
        placeholder: __('Loading'),
        options: [],
      },
    );
    this.editCustomModalOptions = customModalOptions.mergeIn(
      [0], {
        isLoading: true,
        placeholder: __('Loading'),
        options: [],
      },
    );
  }
  componentWillMount() {
    this.getApModelList();
  }
  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.getIn(['action']);
    let ret;

    if (actionType === 'add') {
      ret = this.props.save('/goform/getApFirmwarel', $$actionQuery.merge($$curListItem).toJS())
        .then((json) => {
          const state = json && json.state;
          let newRet;
          if (state.code === 4000) {
            newRet = __("There's no active version of the model,it should be activated!");
          }
          return newRet;
        });
    }
    return ret;
  }
  onAddSave() {
      console.log();
      this.props.save();
  }
  onEditSave() {
    const { store, route } = this.props;
    const $$curListItem = store.getIn([route.id, 'curListItem']);
    return this.props.save('/goform/modifyApFirmware', $$curListItem.toJS());
  }
  getApModelList() {
    this.props.fetch('/goform/getApModel', {
      page: 1,
      size: 500,
    })
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list.map(
            item => ({
              value: item.name,
              label: item.name,
            }),
          );
        }

        this.setState({
          updateModel: !this.state.updateModel,
        });
        this.myEditFormOptions = listOptions.mergeIn(
          [0, 'formProps'], {
            isLoading: false,
            placeholder: undefined,
            options,
          },
        );
        this.editCustomModalOptions = customModalOptions.mergeIn(
          [0], {
            isLoading: false,
            placeholder: undefined,
            options,
          },
        );
      },
    );
  }
  renderCustomModal() {
    const { store, app, route } = this.props;
    const isAdd = store.getIn([route.id, 'actionQuery', 'action']) === 'add';
    const isEdit = store.getIn([route.id, 'actionQuery', 'action']) === 'edit';
    const isDelete = store.getIn([route.id, 'actionQuery', 'action']) === 'delete';
    if (!isAdd  && !isEdit && !isDelete) {
      return null;
    }
    if (isAdd) {
      return (
        <FormContainer
          id="add"
          options={this.editCustomModalOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onAddSave()}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="ssss"
          hasSaveButton
        />
      );
    } else if (isDelete) {
      return (
        <FormContainer
          id="delete"
          options={this.editCustomModalOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onAddSave()}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="ssss"
          hasSaveButton
        />
      );
    }

    return (
      <FormContainer
        id="edit"
        options={this.editCustomModalOptions}
        data={store.getIn([route.id, 'curListItem'])}
        onChangeData={this.props.updateCurEditListItem}
        onSave={() => this.onEditSave()}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        isSaving={app.get('saving')}
        savedText="success"
        hasSaveButton
      />
    );
  }
  render() {
    const curListOptions = this.myEditFormOptions
      .setIn([-1, 'render'], (val, $$data) => (
        <span>
          <Button
            text={__('Edit')}
            key="editActionButton"
            icon="eye"
            style={{
              marginRight: '10px',
            }}
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'edit',
                myTitle: __('Edit Message'),
              });
              this.props.updateCurEditListItem({
                model: $$data.get('model'),
                softVersion: $$data.get('softVersion'),
                fileName: $$data.get('fileName'),
                uploadPath: $$data.get('uploadPath'),
                active: $$data.get('active'),
              });
            }}
          />
          <Button
            text={__('Delete')}
            key="deleteActionButton"
            icon="mail-forward"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'delete',
                myTitle: __('Delete'),
              });
            }}
          />
        </span>),
      )
      ;
    const listActionBarChildren = (
      <span>
        <Button
          text={__('Add')}
          key="addActionButton"
          icon="envelope-o"
          theme="primary"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'add',
            myTitle: __('Add Message'),
          })}
        />
        <Button
          text={__('Delete')}
          key="deleteActionButton"
          icon="envelope-o"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'delete',
            myTitle: __('Delete Message'),
          })}
        />
      </span>

    );
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        editFormOption={{
          hasFile: true,
        }}
        modalChildren={this.renderCustomModal()}
        actionBarChildren={listActionBarChildren}
        deleteable={false}
        editable={false}
        addable={false}
        actionable
        selectable
        noTitle
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
