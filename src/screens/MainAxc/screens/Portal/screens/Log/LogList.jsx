import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import moment from 'moment';

const defaultQuery = {
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
};
const listOptions = fromJS([
  {
    id: 'info',
    text: __('Log Content'),
    formProps: {
      required: true,
    },
  }, {
    id: 'recDate',
    text: __('Record Date'),
    type: 'text',
    formProps: {
      required: true,
    },
  },
]);
const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
        }
      });
  }

  render() {
    const queryFormOptions = fromJS([
      {
        id: 'startDate',
        type: 'date',
        label: __('Start Date'),
        isOutsideRange: () => false,
        onChange: (data) => {
          Promise.resolve().then(() => {
            const { store } = this.props;
            const curScreenId = store.get('curScreenId');
            const endDate = store.getIn([curScreenId, 'query', 'endDate']);
            let startDate = data.value;
            const curDate = moment().format('YYYY-MM-DD');
            const overDate = moment(curDate).isBefore(startDate);
            const diff = moment(endDate).isBefore(startDate);
            if (diff) {
              this.props.createModal({
                type: 'alert',
                text: __(
                  '%s should be the date of today or before %s!',
                    __('Start Date'),
                    __('End Date'),
                ),
              });
              startDate = endDate;
              this.props.changeScreenQuery({ startDate });
            } else if (!diff && overDate) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 'Please choose the date of today or before today!',
                ),
              });
              startDate = curDate;
              this.props.changeScreenQuery({ startDate });
            } else {
              this.props.changeScreenQuery({ startDate });
            }
          });
        },
        // saveOnChange: true,
      }, {
        id: 'endDate',
        type: 'date',
        label: __('End Date'),
        onChange: (data) => {
          Promise.resolve().then(() => {
            const { store } = this.props;
            const curScreenId = store.get('curScreenId');
            const startDate = store.getIn([curScreenId, 'query', 'startDate']);
            let endDate = data.value;
            const curDate = moment().format('YYYY-MM-DD');
            const overDate = moment(curDate).isBefore(endDate);
            const diff = moment(endDate).isBefore(startDate);
            if (diff) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 '%s should be the date of today or after %s !',
                    __('End Date'),
                    __('Start Date'),
                ),
              });
              endDate = curDate;
              this.props.changeScreenQuery({ endDate });
            } else if (!diff && overDate) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 'Please choose the date of today or before today!',
                ),
              });
              endDate = curDate;
              this.props.changeScreenQuery({ endDate });
            } else {
              this.props.changeScreenQuery({ endDate });
            }
          });
        },
        isOutsideRange: () => false,
        saveOnChange: true,
      },
    ]);
    return (
      <AppScreen
        {...this.props}
        initOption={{
          query: defaultQuery,
        }}
        queryFormOptions={queryFormOptions}
        listOptions={listOptions}
        actionable
        selectable
        addable={false}
        editable={false}
        searchable
        searchProps={{
          placeholder: `${__('IP')}`,
        }}
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

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
)(OpenPortalBase);
