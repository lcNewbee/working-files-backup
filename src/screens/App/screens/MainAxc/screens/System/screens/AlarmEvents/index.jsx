import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import {
  Table, Select, Button,
} from 'shared/components';

// custom
import * as actions from './actions';
import myReducer from './reducer';

const clientsTableOptions = fromJS([
  {
    id: 'time',
    text: _('Time'),
    width: '200',
  }, {
    id: 'type',
    text: _('Type'),
    width: '180',
  }, {
    id: 'loginfo',
    text: _('Describe'),
  },
]);
const msg = {
  TITLE: _('Alarm Events'),
  perPage: _('Items per page: '),
};
const selectOptions = [
  { value: 20, label: `${msg.perPage}20` },
  { value: 50, label: `${msg.perPage}50` },
  { value: 100, label: `${msg.perPage}100` },
];

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  changeAlarmEventsQuery: PropTypes.func,
  leaveAlarmEventsScreen: PropTypes.func,
  fetchAlarmEvents: PropTypes.func,
};
const defaultProps = {
  Component: 'span',
};

// 原生的 react 页面
class View extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleSearch', 'handleChangeQuery', 'onPageChange',
        'onAction', 'onChangeSearchText', 'onChangeType', 'onChangeTableSize');
  }
  componentWillMount() {
    this.handleSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.handleSearch();
    }
  }

  componentWillUnmount() {
    this.props.leaveAlarmEventsScreen();
  }

  onAction(mac, action, wirelessType) {
    const subData = {
      action,
      macs: [
        mac,
      ],
    };

    if (typeof wirelessType === 'string') {
      subData.wirelessType = wirelessType;
    }

    this.handleActions(subData, true);
  }

  onChangeSearchText(val) {
    this.handleChangeQuery({
      search: val,
    });
  }

  onChangeType(data) {
    this.handleChangeQuery({
      type: data.value,
    }, true);
  }

  onChangeTableSize(data) {
    this.handleChangeQuery({
      size: data.value,
      page: 1,
    }, true);
  }

  onPageChange(i) {
    this.handleChangeQuery({
      page: i,
    }, true);
  }

  handleSearch() {
    this.props.fetchAlarmEvents();
  }

  binds(...methods) {
    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  handleChangeQuery(data, needSearch) {
    this.props.changeAlarmEventsQuery(data);

    if (needSearch) {
      this.handleSearch();
    }
  }

  render() {
    const { app, store } = this.props;
    const noControl = app.get('noControl');
    const query = store.get('query').toJS();
    const myData = store.get('data');

    // 添加操作项
    let options = clientsTableOptions;

    let tableOptions = options;

    if (noControl) {
      options = options.delete(-1);
      tableOptions = tableOptions.delete(-1);
    }
    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="m-action-bar clearfix">
          <Button
            icon="download"
            text={_('导出列表')}
          />
          <Select
            className="fr"
            clearable={false}
            value={query.size}
            onChange={this.onChangeTableSize}
            options={selectOptions}
            searchable={false}
          />
        </div>

        <Table
          className="table"
          options={tableOptions}
          list={myData.get('list')}
          page={myData.get('page')}
          onPageChange={this.onPageChange}
          loading={store.get('fetching')}
        />
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.events;
  return {
    app: state.app,
    store: myState,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(View);

export const reducer = myReducer;

