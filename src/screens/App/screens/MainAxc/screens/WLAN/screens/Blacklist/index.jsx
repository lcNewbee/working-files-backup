import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import { SaveButton, Button } from 'shared/components/Button';
import AppScreen from 'shared/components/Template/AppScreen';
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
  changeScreenActionQuery: PropTypes.func,
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
      'renderActionBar',
      'renderCopyFromOther',
    ]);
  }
  onSave(actionType, copyFromGroupId) {
    if (actionType === 'copy') {
      if (copyFromGroupId > 0) {
        this.props.onListAction();
      } else {
        this.props.createModal({
          role: 'alert',
          text: _('Please select copy from group'),
        });
      }
    }
  }
  onSelectCopyFromGroup(groupId, e) {
    e.preventDefault();
    this.props.changeScreenActionQuery({
      copyFromGroupId: groupId,
    });
  }
  renderActionBar() {
    return (
      <Button
        text={_('Copy From Other Group')}
        key="cpoyActionButton"
        icon="copy"
        theme="primary"
        onClick={() => {
          this.props.changeScreenActionQuery({
            action: 'copy',
            myTitle: _('Copy From Other Group'),
          });
        }}
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

    if (!isCopyShow) {
      return null;
    }

    return (
      <div className="o-list">
        <h3 className="o-list__header">{_('Group List')}</h3>
        <ul className="m-menu m-menu--open">
          {
            $$group.getIn(['list']).map((item) => {
              const curId = item.get('id');
              let classNames = 'm-menu__link';

              // 不能管理 All Group
              if (curId === selectGroupId || curId === -100) {
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
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={app.get('saving')}
              onClick={() => this.onSave('copy', copyFromGroupId)}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
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
