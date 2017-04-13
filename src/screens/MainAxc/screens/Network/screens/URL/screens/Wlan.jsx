import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';

function getFilterGroup() {
  return utils.fetch('goform/network/url/bindrules')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.filterGroup,
            label: `${item.filterGroup}`,
          }),
        ),
      }
    ),
  );
}

const listOptions = fromJS([
  {
    id: 'ssid',
    text: __('SSID'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'filterGroup',
    text: __('Rules Group'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'filterMode',
    text: __('URL Filter Mode'),
    formProps: {
      required: true,
      type: 'select',
    },
    options: [
      {
        value: '0',
        label: __('Black List'),
      }, {
        value: '1',
        label: __('White List'),
      },
    ],
  }, {
    id: 'isFilter',
    text: __('URL Filter State'),
    noForm: true,
    formProps: {
      required: true,
      type: 'select',
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  }, {
    id: '__actions__',
    text: __('Actions'),
    noForm: true,
  },
]);
const wlanOptions = fromJS([
  {
    id: 'ssid',
    label: __('SSID'),
  }, {
    id: 'filterGroup',
    label: __('Rules Group'),
    type: 'select',
  }, {
    id: 'filterMode',
    label: __('URL Filter Mode'),
    type: 'select',
    options: [
      {
        value: '0',
        label: __('Black List'),
      }, {
        value: '1',
        label: __('White List'),
      },
    ],
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
      'renderCustomModal',
    ]);
    this.screenId = props.route.id;
    this.state = {
      filterGroupOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getFilterGroup()
      .then(
        (data) => {
          this.setState({
            filterGroupOptions: fromJS(data.options),
          });
        },
      );
  }
  onSave() {
    this.props.onListAction({
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
    const curWlanOptions = wlanOptions.setIn([1, 'options'], this.state.filterGroupOptions);
    if (!openFilter) {
      return null;
    }
    return (
      <FormContainer
        id="openFilter"
        options={curWlanOptions}
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
      .setIn([1, 'options'], this.state.filterGroupOptions)
      .setIn([-1, 'transform'], (val, $$data) => (
        <span>
          <Button
            text={__('Open Filter')}
            key="filterActionButton"
            icon="filter"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'filter',
                myTitle: __('Filter'),
              });
              this.props.updateCurEditListItem({
                ssid: $$data.get('ssid'),
              });
            }}
          />
        </span>),
      );
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
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
