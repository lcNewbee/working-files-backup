import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import { SaveButton, Button } from 'shared/components/Button';
import AppScreen from 'shared/components/Template/AppScreen';
import Table from 'shared/components/Table';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

import './_acl.scss';

const listTypeMap = {};
const $$listTypeOptions = fromJS([
  {
    value: 'black',
    label: _('Black List'),
  }, {
    value: 'white',
    label: _('White List'),
  },
]).map(
  ($$item) => {
    listTypeMap[$$item.get('value')] = $$item.get('label');
    return $$item;
  },
);
const settingsOptions = fromJS([
  {
    id: 'type',
    label: _('Type Switch'),
    className: 'no-label',
    type: 'switch',
    options: $$listTypeOptions,
    saveOnChange: true,
  },
]);

const listOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  }, {
    id: 'vendor',
    text: _('Manufacturer'),
    noForm: true,
  }, {
    id: 'clientType',
    text: _('Client Type'),
    noForm: true,
  }, {
    id: 'reason',
    text: _('Reason'),
    formProps: {
      type: 'textarea',
      maxLength: 256,
      validator: validator({
        rules: 'len[1,256]',
      }),
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  group: PropTypes.instanceOf(Map),
  groupid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  route: PropTypes.object,
  changeScreenActionQuery: PropTypes.func,
  fetch: PropTypes.func,
  reciveScreenData: PropTypes.func,
  createModal: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class Blacklist extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onSave',
      'onSelectCopyFromGroup',
      'onOpenCopyBlacklistModal',
      'onSelectCopyBlacklist',
      'fetchCopyGroupBlacklist',
      'renderActionBar',
      'renderCopyFromOther',
      'onBeforeSave',
    ]);
  }
  onBeforeSave($$actionQuery) {
    const { store, route } = this.props;
    const aclType = store.getIn([route.id, 'data', 'settings', 'type']);
    const actionType = $$actionQuery.get('action');

    if (actionType === 'add') {
      this.props.changeScreenActionQuery({
        type: aclType,
      });
    }
  }
  onSave(actionType) {
    const { store, route } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
    const aclType = store.getIn([route.id, 'data', 'settings', 'type']);

    if (actionType === 'copy') {
      const $$copyGroupBlacklist = $$myScreenStore.getIn(['data', 'copyGroupBlacklist']);
      const copySelectedList = $$copySelectedList.map(
        index => $$copyGroupBlacklist.getIn(['list', index, 'mac']),
      ).toJS();

      // 没有选择要拷贝的 Ssids
      if ($$copySelectedList.size < 1) {
        this.props.createModal({
          type: 'alert',
          text: _('Please select item'),
        });
      } else {
        this.props.changeScreenActionQuery({
          type: aclType,
          copySelectedList,
        });
        this.props.onListAction();
      }
    }
  }
  onSelectCopyFromGroup(groupId, e) {
    const { store, route } = this.props;
    const aclType = store.getIn([route.id, 'data', 'settings', 'type']);

    e.preventDefault();
    this.props.changeScreenActionQuery({
      copyFromGroupId: groupId,
      copySelectedList: fromJS([]),
      type: aclType,
    });
    this.fetchCopyGroupBlacklist(groupId);
  }
  onSelectCopyBlacklist(data) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
    let $$copyGroupBlacklist = $$myScreenStore.getIn(['data', 'copyGroupBlacklist']);
    let $$newCopySelectedList = $$copySelectedList;

    $$copyGroupBlacklist = $$copyGroupBlacklist.update('list',
      ($$list) => {
        const ret = immutableUtils.selectList(
          $$list,
          data,
          $$copySelectedList,
        );

        $$newCopySelectedList = ret.selectedList;

        return ret.$$list;
      },
    );

    this.props.reciveScreenData({
      copyGroupBlacklist: $$copyGroupBlacklist,
    }, this.props.route.id);

    this.props.changeScreenActionQuery({
      copySelectedList: $$newCopySelectedList,
    });
  }
  onOpenCopyBlacklistModal() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);

    this.props.changeScreenActionQuery({
      action: 'copy',
      myTitle: _('Copy Form Other Group'),
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupBlacklist(copyFromGroupId);
  }

  fetchCopyGroupBlacklist(groupid) {
    const { store, route } = this.props;
    const fetchUrl = this.props.route.fetchUrl || this.props.route.formUrl;
    const aclType = store.getIn([route.id, 'data', 'settings', 'type']);
    const queryData = {
      groupid,
    };

    if (groupid === -100) {
      queryData.filterGroupid = this.props.groupid;
    }

    if (aclType) {
      queryData.aclType = aclType;
    }

    this.props.fetch(fetchUrl, queryData).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.props.reciveScreenData({
            copyGroupBlacklist: json.data,
          }, this.props.route.id);
        }
      },
    );
  }
  renderActionBar() {
    return (
      <Button
        text={_('Copy From Other Group')}
        key="cpoyActionButton"
        icon="copy"
        theme="primary"
        onClick={() => this.onOpenCopyBlacklistModal()}
      />
    );
  }
  renderCopyFromOther() {
    const { store, app, route } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const isCopyShow = $$myScreenStore.getIn(['actionQuery', 'action']) === 'copy';
    const $$group = this.props.group;
    const selectGroupId = $$group.getIn(['selected', 'id']);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);
    const listType = store.getIn([route.id, 'data', 'settings', 'type']);

    if (!isCopyShow) {
      return null;
    }

    return (
      <div className="row">
        <div className="o-list cols col-4">
          <h3 className="o-list__header">{_('Group List')}</h3>
          <ul className="m-menu m-menu--open">
            {
              $$group.getIn(['list']).map((item) => {
                const curId = item.get('id');
                let classNames = 'm-menu__link';

                // 不能选择自己组, 或黑白名单类型不一样的组
                if (curId === selectGroupId ||
                    ((item.get('aclType') !== listType) && curId !== -100)) {
                  return null;
                }

                if (curId === copyFromGroupId) {
                  classNames = `${classNames} active`;
                }

                return (
                  <li key={curId}>
                    <a
                      className={classNames}
                      onClick={
                        e => this.onSelectCopyFromGroup(curId, e)
                      }
                    >
                      {item.get('groupname')}
                    </a>
                  </li>
                );
              })
            }
          </ul>

        </div>
        <div className="o-list cols col-8">
          <h3 className="o-list__header">{_('Group Blacklist')}</h3>
          <Table
            options={listOptions}
            list={$$myScreenStore.getIn(['data', 'copyGroupBlacklist', 'list'])}
            psge={$$myScreenStore.getIn(['data', 'copyGroupBlacklist', 'page'])}
            onRowSelect={this.onSelectCopyBlacklist}
            selectable
          />
          <div className="o-list__footer">
            <SaveButton
              type="button"
              className="fr"
              loading={app.get('saving')}
              onClick={() => this.onSave('copy')}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { route, store } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isCopySsid = actionQuery.get('action') === 'copy';
    const listType = store.getIn([route.id, 'data', 'settings', 'type']);
    const listTitle = listTypeMap[listType];

    return (
      <AppScreen
        // Screen 全局属性
        {...this.props}
        className="s-group-wireless-acl"

        settingsFormOptions={settingsOptions}

        // List Props
        listOptions={listOptions}
        actionBarChildren={this.renderActionBar()}
        modalChildren={this.renderCopyFromOther()}
        listKey="allKeys"
        listTitle={listTitle}
        editable={false}
        initOption={{
          actionQuery: {
            copyFromGroupId: -100,
          },
        }}
        modalSize={isCopySsid ? 'lg' : 'md'}
        onBeforeSave={this.onBeforeSave}
        actionable
        selectable
        noTitle
      />
    );
  }
}

Blacklist.propTypes = propTypes;
Blacklist.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    group: state.product.get('group'),
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
)(Blacklist);
