import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

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
      });
  }
  onChangeData(data) {
  }
  getCurData() {
    return this.props.store.getIn(['data', 'apRelateNum'])
  }
  render() {
    const { app } = this.props;
    const { getCurData } = this;

    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="text"
          label={_('AP关联量')}
          value={getCurData('apRelateNum')}
          onChange={(option) => this.props.onChangeData({
            apRelateNum: option.value,
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
