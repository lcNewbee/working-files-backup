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

const screenOptions = fromJS([
  {
    id: 'no',
    width: '50',
    text: _('No'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'groupName',
    width: '200',
    text: _('Group Name'),
  }, {
    id: 'defaultAction',
    width: '160',
    text: _('The Default Action'),
    defaultValue: '0',
    formProps: {
      type: 'switch',
      options: [
        _('Accept'),
        _('Throw Away'),
      ],
    },
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);

const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultFormData = {};

// 初始化默认值对象
screenOptions.forEach((item) => {
  const defaultVal = item.get('defaultValue');
  if (defaultVal) {
    defaultFormData[item.get('id')] = defaultVal;
  }
});

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
    console.log(defaultFormData)
    return (
      <ListInfo
        {...this.props}
        tableOptions={this.tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultFormData}
        controlAbled
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
