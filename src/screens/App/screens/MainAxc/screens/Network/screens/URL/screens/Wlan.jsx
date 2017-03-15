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
    text: _('SSID'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'filterGroup',
    text: _('Rules Group'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'filterMode',
    text: _('URL Filter Mode'),
    formProps: {
      required: true,
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
    noForm: true,
    formProps: {
      required: true,
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
        label: _('Black List'),
      }, {
        value: '1',
        label: _('White List'),
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
