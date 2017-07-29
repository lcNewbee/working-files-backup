import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, fromJS } from 'immutable';
import validator from 'shared/validator';
import FormContainer from 'shared/components/Organism/FormContainer';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const msg = {
  upSpeed: __('Up Speed'),
  downSpeed: __('Down Speed'),
  selectGroup: __('Select Group'),
};
const formOptions = fromJS([
  {
    id: 'groupname',
    label: msg.selectGroup,
    fieldset: 'group',
    legend: __('Current Group'),
    type: 'select',
    required: true,
  }, {
    id: 'thinenable',
    label: __('AP Mode'),
    legend: __('Settings'),
    fieldset: 'mode',
    defaultValue: '1',
    options: [
      {
        value: 0,
        label: __('Fat AP'),
      }, {
        value: 1,
        label: __('Thin AP'),
      },
    ],
    inputStyle: {
      width: '200px',
    },
    type: 'switch',
    required: true,
  }, {
    id: 'thindiscovery',
    label: __('Discovery Type'),
    fieldset: 'mode',
    defaultValue: 'dhcp',
    options: [
      {
        value: 'dhcp',
        label: __('DHCP'),
      }, {
        value: 'static',
        label: __('Static'),
      },
    ],
    inputStyle: {
      width: '200px',
    },
    type: 'switch',
    required: true,
    visible: $$data => $$data.get('thinenable') === 1,
  }, {
    id: 'thinacip',
    label: __('AC IP'),
    fieldset: 'mode',
    type: 'text',
    required: true,
    visible:
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
        label = __('Ungrouped Devices');
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
  updateCurListItem: PropTypes.func.isRequired,
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
      this.props.updateCurListItem(data);
    }
  }

  render() {
    const { app, store } = this.props;
    const $$curData = store.getIn([this.screenId, 'curListItem']);

    return (
      <AppScreen
        {...this.props}
        initOption={{
          defaultListItem: {
            thinenable: 1,
            thindiscovery: 'dhcp',
            thinacip: '',
          },
        }}
      >
        <h3
          style={{
            color: 'red',
            marginLeft: '25px',
          }}
        >
          {__('Note: If Access Manager control is needed, please  set the mode of the current group as Fat AP')}
        </h3>
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
