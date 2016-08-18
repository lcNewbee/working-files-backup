import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import channels from 'shared/config/channels.json';

import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const channelsList = List(channels);

const propTypes = {
  onCollapse: PropTypes.func,
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onRemove: PropTypes.func,
  onSave: PropTypes.func,

  isCollapsed: PropTypes.bool,
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
};
class DeviceSystem extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getCurData = this.getCurData.bind(this)
  }
  onSave() {
    const subData = this.props.store.get('data').toJS();

    this.props.onSave('/goform/asd', subData)
      .then((json) => {
        console.log(json);
      });
  }
  onChangeData(data) {
    console.log(data);
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name])
  }
  getChannelsOptions(currCountry) {
    let i;
    let len;
    let channelsRange;
    const channelsOptions = [
      {
        value: '0',
        label: _('auto'),
      },
    ];
    const channelsOption = channelsList.find((item) => {
      return item.country === currCountry;
    });

    if (channelsOption) {
      channelsRange = channelsOption['2.4g'].split('-');
      i = parseInt(channelsRange[0], 10);
      len = parseInt(channelsRange[1], 10);
    } else {
      i = 1;
      len = 13;
    }

    for (i; i <= len; i++) {
      channelsOptions.push({
        value: `${i}`,
        label: `${i}`,
      });
    }

    return channelsOptions;
  }
  render() {
    const { app } = this.props;
    const { getCurData } = this;
    const channelsOptions = this.getChannelsOptions('CN');

    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="select"
          label={_('Channel')}
          options={channelsOptions}
          value={getCurData('channel')}
          onChange={(option) => this.props.onChangeData({
            channel: option.value,
          })}
        />
        <SaveButton
          size="sm"
          loading={app.get('saving')}
          onClick={this.onSave}
        />
      </div>
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
