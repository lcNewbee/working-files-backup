import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import FormGroup from 'shared/components/Form/FormGroup';
import SaveButton from 'shared/components/Button/SaveButton';
import ProgressBar from 'shared/components/ProgressBar';
import Modal from 'shared/components/Modal';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';

const propTypes = {
  fetch: PropTypes.func,
  save: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
  route: PropTypes.object,
  createModal: PropTypes.func,
  store: PropTypes.instanceOf(Map),
};

export default class ModeModify extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.saveModalChange = this.saveModalChange.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: { showProgressBar: false },
    });
    this.props.fetch('goform/get_firstLogin_info')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.updateItemSettings({
              nextMode: json.data.fatOrThin,
              currMode: json.data.fatOrThin,
            });
          }
        });
  }

  onSave() {
    const nextMode = this.props.store.getIn(['curData', 'nextMode']);
    if (nextMode === 'thin') {
      this.props.createModal({
        role: 'alert',
        text: _('Modal Changed, Reboot to take effect ?'),
        apply: this.saveModalChange,
      });
    }
  }

  saveModalChange() {
    this.props.save('goform/set_fatOrThin', { fatOrThin: 'thin' })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.updateItemSettings({ showProgressBar: true });
          }
        });
  }

  render() {
    const nextMode = this.props.store.getIn(['curData', 'nextMode']);
    return (
      <div>
        <FormGroup
          type="checkbox"
          label={_('Modify Device Into Thin Mode')}
          checked={nextMode === 'thin'}
          onChange={() => {
            this.props.updateItemSettings({ nextMode: nextMode === 'fat' ? 'thin' : 'fat' });
          }}
        />
        <SaveButton
          onClick={() => this.onSave()}
        />
        <Modal
          className="excUpgradeBar"
          isShow={this.props.store.getIn(['curData', 'showProgressBar'])}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
        >
          <ProgressBar
            title={_('rebooting , please wait...')}
            time={60}
            callback={() => {
              this.props.updateItemSettings({ showProgressBar: false });
              window.location.href = '#';
            }}
            start
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
        </Modal>
      </div>
    );
  }
}

ModeModify.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions, sharedActions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModeModify);
