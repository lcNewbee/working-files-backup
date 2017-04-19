import React from 'react';
import { fromJS } from 'immutable';
import { FormInput } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const listOptions = fromJS([
      {
        id: 'time',
        type: 'text',
        text: __('Time'),
        notEditable: true,
      },
      {
        id: 'srcIp',
        text: __('Source IP'),
      },
      {
        id: 'destIp',
        text: __('Destiation IP'),
      },
    ]);
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        listTitle={__('Protocol')}
      >
        <div
          style={{
            position: 'absolute',
            margin: '10px 0',
            top: '8',
            left: '55px',
          }}
        >
          {/* <span
            style={{
              fontWeight: 'bold',
            }}
          >
            {__('Protocol')}
          </span>*/}
          <FormInput
            type="select"
            value={store.getIn([curScreenId, 'query', 'proto'])}
            options={[
              { label: 'TCP', value: 'tcp' },
              { label: 'UDP', value: 'udp' },
              { label: 'ICMP', value: 'icmp' },
            ]}
            onChange={(data) => {
              Promise.resolve().then(() => {
                this.props.changeScreenQuery({ proto: data.value });
              }).then(() => {
                this.props.fetchScreenData();
              });
            }}
          />
        </div>
      </AppScreen>
    );
  }
}

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

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
