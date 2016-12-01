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
      maxLength: 128,
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  group: PropTypes.instanceOf(Map),
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
    ]);
  }
  onSave(actionType) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);

    if (actionType === 'copy') {
      // 没有选择要拷贝的 Ssids
      if ($$copySelectedList.size < 1) {
        this.props.createModal({
          type: 'alert',
          text: _('Please select ssid'),
        });
      } else {
        this.props.onListAction();
      }
    }
  }
  onSelectCopyFromGroup(groupId, e) {
    e.preventDefault();
    this.props.changeScreenActionQuery({
      copyFromGroupId: groupId,
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupBlacklist(groupId);
  }
  onSelectCopyBlacklist(data) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    let $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
    let $$copyGroupBlacklist = $$myScreenStore.getIn(['data', 'copyGroupBlacklist']);

    $$copyGroupBlacklist = $$copyGroupBlacklist.update('list',
      ($$list) => {
        const ret = immutableUtils.selectList(
          $$list,
          data,
          $$copySelectedList,
        );
        $$copySelectedList = ret.selectedList.map(
          index => $$copyGroupBlacklist.getIn(['list', index, 'mac']),
        );

        return ret.$$list;
      },
    );

    this.props.reciveScreenData({
      copyGroupBlacklist: $$copyGroupBlacklist,
    }, this.props.route.id);
    this.props.changeScreenActionQuery({
      copySelectedList: $$copySelectedList,
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
    const fetchUrl = this.props.route.fetchUrl || this.props.route.formUrl;

    this.props.fetch(fetchUrl, {
      groupid,
    }).then(
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
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const isCopyShow = $$myScreenStore.getIn(['actionQuery', 'action']) === 'copy';
    const $$group = this.props.group;
    const selectGroupId = $$group.getIn(['selected', 'id']);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);
    const copyFromGroupName = '';

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

                // 不能选择自己组
                if (curId === selectGroupId) {
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

    return (
      <AppScreen
        // Screen 全局属性
        {...this.props}
        // List Props
        listOptions={listOptions}
        actionBarChildren={this.renderActionBar()}
        modalChildren={this.renderCopyFromOther()}
        listKey="allKeys"
        editable={false}
        initOption={{
          actionQuery: {
            copyFromGroupId: -100,
          },
        }}
        modalSize={isCopySsid ? 'lg' : 'md'}
        actionable
        selectable
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
