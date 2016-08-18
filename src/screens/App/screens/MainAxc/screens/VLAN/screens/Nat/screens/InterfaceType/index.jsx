import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, Switchs,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

const tableOptions = fromJS([
  {
    id: 'no',
    width: '50',
    text: _('No'),
  }, {
    id: 'noInfo',
    width: '200',
    text: _('Interface No Information'),
  }, {
    id: 'interfaceType',
    width: '160',
    text: _('Switch Interface Type'),
  }, {
    id: 'rulesAssociated',
    text: `${_('Rules Associated')} (${_('Rule ID')} [ ${_('Rule Type')} ])`,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  componentWillMount() {
    this.tableOptions = tableOptions.set(2, Map({
      id: 'interfaceType',
      width: '200',
      text: _('Switch Interface Type'),
      transform: (val, item, index) => {
        const no = item.get('id');
        return (
          <Switchs
            options={[
              '内部',
              '外部',
              '正常',
            ]}
            size="sm"
            value={val}
            onChange={
              (data) => this.onAction(no, data.value)
            }
          />
        );
      },
    }));
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json)
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={this.tableOptions}
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
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
