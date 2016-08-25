import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

function getInterfaceTypeOptions() {
  return utils.fetch('/goform/interfaceType')
    .then((json) => (
      {
        options: json.data.list.map(
          (item) => ({
            value: item.no,
            label: `${item.no}(${item.noInfo})`,
          })
        ),
      }
    )
  );
}
const screenOptions = fromJS([
  {
    id: 'no',
    width: '50',
    text: _('No'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'rulesGroup',
    width: '200',
    text: _('Rules Group'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Rules Group'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'rules',
    text: _('Rules'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Rules'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
      multi: true,
    },
  },
]);

const tableOptions = immutableUtils.getTableOptions(screenOptions);

const editFormOptions = immutableUtils.getFormOptions(screenOptions);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateEditListItem: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  componentWillMount() {
    this.tableOptions = tableOptions;
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json);
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={this.tableOptions}
        editFormOptions={editFormOptions}
        actionable
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
