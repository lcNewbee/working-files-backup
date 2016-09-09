import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  FormContainer,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'time',
    text: _('Retain Days'),
    fieldset: 'retainDays',
    legend: _('Log Retain Days'),
    defaultValue: '7',
    formProps: {
      type: 'number',
      help: _('Days'),
    },
  },
]);
const formOptions = immutableUtils.getFormOptions(screenOptions);
const defaultFormData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  updateListSettings: PropTypes.func,
  reportValidError: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    const initOption = {
      listId: props.route.id,
      formUrl: props.route.formUrl,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
    };
    super(props);
    this.saveUrl = props.route.saveUrl || props.route.formUrl;
    this.onAction = this.onAction.bind(this);

    if (defaultFormData) {
      initOption.defaultSettingsData = defaultFormData;
    }
    this.props.initList(initOption);
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
    const { store, app } = this.props;
    const myListId = store.get('curListId');
    const settingsData = store.getIn([myListId, 'curSettings']);

    if (myListId === 'base') {
      return null;
    }

    return (
      <FormContainer
        action={this.saveUrl}
        method="POST"
        data={settingsData}
        options={formOptions}
        isSaving={app.get('saving')}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        onSave={this.onSave}
        onChangeData={this.props.updateListSettings}
        onValidError={this.props.reportValidError}
        hasSaveButton
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
    screenActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
