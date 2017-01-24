import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map, fromJS } from 'immutable';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import FormContainer from 'shared/components/Organism/FormContainer';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const msg = {
  upSpeed: _('Up Speed'),
  downSpeed: _('Down Speed'),
  selectGroup: _('Select Group'),
};
const formOptions = fromJS([
  {
    id: 'groupname',
    label: msg.selectGroup,
    fieldset: 'group',
    legend: _('Current Group'),
    type: 'select',
    required: true,
  }, {
    id: 'thinenable',
    label: _('AP Mode'),
    legend: _('Settings'),
    fieldset: 'mode',
    defaultValue: '1',
    options: [
      {
        value: 0,
        label: _('Fat AP'),
      }, {
        value: 1,
        label: _('Thin AP'),
      },
    ],
    inputStyle: {
      width: '200px',
    },
    type: 'switch',
    required: true,
  }, {
    id: 'thindiscovery',
    label: _('Discovery Type'),
    fieldset: 'mode',
    defaultValue: 'dhcp',
    options: [
      {
        value: 'dhcp',
        label: _('DHCP'),
      }, {
        value: 'static',
        label: _('Static'),
      },
    ],
    inputStyle: {
      width: '200px',
    },
    type: 'switch',
    required: true,
    showPrecondition: $$data => $$data.get('thinenable') === 1,
  }, {
    id: 'thinacip',
    label: _('AC IP'),
    fieldset: 'mode',
    type: 'text',
    required: true,
    showPrecondition:
      $$data => (
        $$data.get('thindiscovery') === 'static' &&
        $$data.get('thinenable') === 1
      ),
    validator: validator({
      rules: 'ip',
    }),
  },
]);

function getGroupOptions($$list) {
  if (!$$list) {
    return [];
  }
  return $$list.map(
    ($$item) => {
      const groupname = $$item.get('groupname');
      let label = groupname;

      if (groupname === 'Default') {
        label = _('Ungrouped Devices');
      }

      return $$item.clear().merge({
        value: groupname,
        label,
      });
    },
  );
}

const propTypes = {
  route: PropTypes.object.isRequired,
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map).isRequired,
  updateCurEditListItem: PropTypes.func.isRequired,
  validateAll: PropTypes.func.isRequired,
  onListAction: PropTypes.func.isRequired,
  editListItemByIndex: PropTypes.func.isRequired,
  activeListItem: PropTypes.func.isRequired,
  reportValidError: PropTypes.func.isRequired,
};

export default class ModeSettings extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onSave',
      'onChangeCurItem',
    ]);
    this.screenId = this.props.route.id;
  }
  componentWillReceiveProps(nextProps) {
    const nextData = nextProps.store.getIn([this.screenId, 'data']);
    const thisData = this.props.store.getIn([this.screenId, 'data']);

    if (nextData !== thisData) {
      this.formOptions = formOptions.setIn(
        [0, 'options'],
        getGroupOptions(nextProps.store.getIn([this.screenId, 'data', 'list'])),
      );

      if (!nextProps.store.getIn([this.screenId, 'curListItem', 'groupname'])) {
        this.props.editListItemByIndex(0, 'edit');
      }
    }
  }
  componentWillUnmount() {

  }

  onSave() {
    this.props.validateAll().then(($$msg) => {
      if ($$msg.isEmpty()) {
        this.props.onListAction();
      }
    });
  }

  onChangeCurItem(data) {
    if (data.groupname) {
      this.props.activeListItem(
        'groupname',
        data.groupname,
        'edit',
      );
    } else {
      this.props.updateCurEditListItem(data);
    }
  }

  render() {
    const { app, store } = this.props;
    const $$curData = store.getIn([this.screenId, 'curListItem']);

    return (
      <AppScreen
        {...this.props}
        defaultEditData={{
          thinenable: 1,
          thindiscovery: 'dhcp',
          thinacip: '',
        }}
      >
        <FormContainer
          options={this.formOptions}
          data={$$curData}
          onChangeData={this.onChangeCurItem}
          onSave={this.onSave}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onValidError={this.props.reportValidError}
          isSaving={app.get('saving')}
          actionable={this.actionable}
          hasSaveButton
        />
      </AppScreen>
    );
  }
}

ModeSettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    store: state.screens,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModeSettings);
