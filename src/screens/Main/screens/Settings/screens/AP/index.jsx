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
    id: 'subversion',
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
    id: 'fm_name',
    label: __('Firmware File'),
    defaultValue: '',
    type: 'file',
    required: true,
    accept: '.bin',
    validator: validator({}),
  }, {
    id: 'upd_path',
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
    id: 'subversion',
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
    id: 'fm_name',
    label: __('Firmware File'),
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
      accept: '.bin',
      validator: validator({}),
    },
  }, {
    id: 'upd_path',
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
    // onClick: ($$data) => {
    //   this.props.save(
    //     '/goform/modifyApFirmware',
    //     {
    //       model: $$data.get('model'),
    //       subversion: $$data.get('subversion'),
    //       fm_name: $$data.get('fm_name'),
    //       upd_path: $$data.get('upd_path'),
    //       active: $$data.get('active'),
    //     },
    //   );
    //   this.props.fetch('/goform/getApFirmware');
    // },
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
  validateAll: PropTypes.func,
  reportValidError: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  fetchScreenData: PropTypes.func,
  createModal: PropTypes.func,
  saveFile: PropTypes.func,
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
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.getIn(['action']);
    let ret;

    if (actionType === 'add') {
      ret = this.props.save('/goform/getApFirmware', $$actionQuery.merge($$curListItem).toJS())
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
    const { store, route } = this.props;
    const $$curListItem = store.getIn([route.id, 'curListItem']);
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.save(
            '/goform/addApFirmware',
            $$curListItem.toJS(),
          ).then((json) => {
            if (json && json.state && json.state.code === 2000) {
              this.props.saveFile(
                '/goform/uploadApBin',
                document.getElementById('modalForm'),
                $$curListItem.toJS(),
              );
              this.props.changeScreenActionQuery({
                action: '',
              });
              this.props.fetchScreenData();
            }
          });
        }
      });
  }
  onEditSave() {
    const { store, route } = this.props;
    const $$curListItem = store.getIn([route.id, 'curListItem']);
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.save(
            '/goform/modifyApFirmware',
            $$curListItem.toJS(),
          ).then((json) => {
            if (json && json.state && json.state.code === 2000) {
              this.props.saveFile(
                '/goform/uploadApBin',
                document.getElementById('modalForm'),
                $$curListItem.toJS(),
              );
              this.props.changeScreenActionQuery({
                action: '',
              });
              this.props.fetchScreenData();
            }
          });
        }
      });
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
              value: item,
              label: item,
            }),
          );
        }
        this.setState({
          updateModel: !this.state.updateModel,
        });
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
    const readOnlyEditModalOptions = this.editCustomModalOptions.map(
        ($$item) => {
          const itemId = $$item.get('id');
          switch (itemId) {
            case 'model':return $$item.set('readOnly', true);
            case 'subversion':return $$item.set('readOnly', true);
            case 'fm_name':
            case 'upd_path':
            case 'active':
            default:
              break;
          }

          return $$item;
        },
      );
    if (!isAdd && !isEdit) {
      return null;
    }
    if (isAdd) {
      return (
        <FormContainer
          id="modalForm"
          component="form"
          action="/goform/addApFirmware"
          method="POST"
          options={this.editCustomModalOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onAddSave()}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onValidError={this.props.reportValidError}
          isSaving={app.get('saving')}
          hasSaveButton
        />
      );
    }
    return (
      <FormContainer
        id="modalForm"
        component="form"
        action="/goform/modifyApFirmware"
        method="POST"
        options={readOnlyEditModalOptions}
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
    const warningMsgText = __('Are you sure to delete the choosed items?');
    const { store, route } = this.props;
    const $$curListItem = store.getIn([route.id, 'curListItem']);
    const selectedListIndex = store.getIn([route.id, 'actionQuery', 'selectedList']);
    const isDelete = store.getIn([route.id, 'actionQuery', 'action']) === 'delete';

    const curListOptions = listOptions
      .setIn([-1, 'render'], (val, $$data) => (
        <span>
          <Button
            text={__('Edit')}
            key="editActionButton"
            icon="edit"
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
                subversion: $$data.get('subversion'),
                fm_name: $$data.get('fm_name'),
                upd_path: $$data.get('upd_path'),
                active: $$data.get('active'),
              });
            }}
          />
          <Button
            text={__('Delete')}
            key="deleteActionButton"
            icon="trash-o"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'delete',
                myTitle: __('Delete'),
              });
              this.props.createModal({
                id: 'settings',
                role: 'confirm',
                text: __('Are you sure to delete the item?'),
                apply: function () {
                  this.props.save(
                    '/goform/delApFirmware',
                    {
                      model: $$data.get('model'),
                      subversion: $$data.get('subversion'),
                      fm_name: $$data.get('fm_name'),
                      upd_path: $$data.get('upd_path'),
                      active: $$data.get('active'),
                    },
                  );
                  this.props.fetchScreenData();
                }.bind(this),
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
          icon="plus"
          theme="primary"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'add',
            myTitle: __('Add Message'),
          })}
        />
        <Button
          text={__('Delete')}
          key="deleteActionButton"
          icon="trash-o"
          onClick={() => {
            this.props.changeScreenActionQuery({
              action: 'delete',
              myTitle: __('Delete'),
            });
            this.props.createModal({
              id: 'settings',
              role: 'confirm',
              text: warningMsgText,
              apply: function () {
                selectedListIndex.forEach((item) => {
                  const selectedList = store.getIn([route.id, 'data', 'list', item]);
                  this.props.save('/goform/delApFirmware', selectedList);
                });
                this.props.fetchScreenData();
              }.bind(this),
            });
          }}
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
        listKey="allKeys"
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
