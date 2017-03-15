import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';

const listOptions = fromJS([
  {
    id: 'ssid',
    text: _('SSID'),
  }, {
    id: 'filterGroup',
    text: _('Rules Group'),
  }, {
    id: 'filterMode',
    text: _('URL Filter Mode'),
    formProps: {
      type: 'select',
    },
    options: [
      {
        value: '0',
        label: _('Black List'),
      }, {
        value: '1',
        label: _('White List'),
      },
    ],
  }, {
    id: 'isFilter',
    text: _('URL Filter State'),
    formProps: {
      type: 'select',
    },
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
  }, {
    id: '__actions__',
    text: _('Actions'),
    noForm: true,
  },
]);

const wlanOptions = fromJS([
  {
    id: 'ssid',
    label: _('SSID'),
  }, {
    id: 'filterGroup',
    label: _('Rules Group'),
    type: 'select',
  }, {
    id: 'filterMode',
    label: _('URL Filter Mode'),
    type: 'select',
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
  },
]);

const groupOptions = fromJS([
  {
    id: 'group_name',
    label: _('Group Name'),
    type: 'text',
  }, {
    id: 'description',
    label: _('Description'),
    type: 'textarea',
  },
]);

const rulesDetailsOptions = fromJS([
  {
    id: 'rule_name',
    label: _('Rule Name'),
    type: 'text',
    required: true,
  },
  {
    id: 'filter_url',
    label: _('Filter URL'),
    type: 'textarea',
    required: true,
    help: _('Filter URL[1-100]'),
  }, {
    id: 'description',
    label: _('Description'),
    type: 'textarea',
    required: true,
  },
]);

const bindRulesOptions = fromJS([
  {
    id: 'group_name',
    label: _('Group Name'),
    type: 'select',
    required: true,
  }, {
    id: 'rules',
    label: _('Filter Rules'),
    type: 'select',
    multi: true,
    required: true,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  store: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onAction = this.onAction.bind(this);
    utils.binds(this, [
      'onSave',
    ]);
    this.screenId = props.route.id;
  }
  onSave() {
    this.props.onListAction({
      url: this.props.route.formUrl,
      needMerge: true,
    });
  }
  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          return json;
        }
        return json;
      });
  }
  renderCustomModal() {
    const { store, app, route } = this.props;
    const openFilter = store.getIn([route.id, 'actionQuery', 'action']) === 'filter';
    const createGroup = store.getIn([route.id, 'actionQuery', 'action']) === 'createGroup';
    const makeFilterRules = store.getIn([route.id, 'actionQuery', 'action']) === 'makeFilterRules';
    const bindRules = store.getIn([route.id, 'actionQuery', 'action']) === 'bindRules';
    if (!openFilter && !createGroup && !makeFilterRules && !bindRules) {
      return null;
    }
    if (createGroup) {
      return (
        <FormContainer
          id="createGroup"
          options={groupOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onSave('createGroup')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="ssss"
          hasSaveButton
        />
      );
    }
    if (makeFilterRules) {
      return (
        <FormContainer
          id="makeFilterRules"
          options={rulesDetailsOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onSave('makeFilterRules')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="ssss"
          hasSaveButton
        />
      );
    }
    if (bindRules) {
      return (
        <FormContainer
          id="bindRules"
          options={bindRulesOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onSave('bindRules')}
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
        id="openFilter"
        options={wlanOptions}
        data={store.getIn([route.id, 'curListItem'])}
        onChangeData={this.props.updateCurEditListItem}
        onSave={() => this.onSave('filter')}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        isSaving={app.get('saving')}
        savedText="success"
        hasSaveButton
      />
    );
  }
  render() {
    const curListOptions = listOptions
      .setIn([-1, 'transform'], (val, $$data) => (
        <span>
          <Button
            text={_('Open Filter')}
            key="filterActionButton"
            icon="filter"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'filter',
                myTitle: _('Filter'),
              });
              this.props.updateCurEditListItem({
                ssid: $$data.get('ssid'),
              });
            }}
          />
        </span>),
      )
      ;
    const listActionBarChildren = (
      <span>
        <Button
          text={_('Create Rules Group')}
          key="createGroupActionButton"
          icon="user-plus"
          theme="primary"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'createGroup',
            myTitle: _('Create Rules Group'),
          })}
        />
        <Button
          text={_('Make Filter Rules')}
          key="makeFilterRulesActionButton"
          icon="edit"
          theme="primary"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'makeFilterRules',
            myTitle: _('Make Filter Rules'),
          })}
        />
        <Button
          text={_('Bind Rules')}
          key="bindRulesActionButton"
          icon="lock"
          theme="primary"
          onClick={() => this.props.changeScreenActionQuery({
            action: 'bindRules',
            myTitle: _('Bind Rules'),
          })}
        />
      </span>

    );
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        actionBarChildren={listActionBarChildren}
        modalChildren={this.renderCustomModal()}
        actionable
        selectable
        editable={false}
        addable={false}
        deleteable={false}
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
