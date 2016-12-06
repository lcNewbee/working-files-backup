import React, { PropTypes } from 'react';
import { Map } from 'immutable';

const propTypes = {
  onCollapse: PropTypes.func,
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onRemove: PropTypes.func,

  isCollapsed: PropTypes.bool,
  item: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};

const defaultProps = {
};

function DeviceOverview(props) {
  const info = props.store.getIn(['data']);
  return (
    <div className="o-description-list">
      <dl className="o-description-list-row">
        <dt>{_('MAC Address')}</dt>
        <dd>{info.get('mac')}</dd>
      </dl>
      <dl className="o-description-list-row">
        <dt>{_('Model')}</dt>
        <dd>{info.get('model')}</dd>
      </dl>
      <dl className="o-description-list-row">
        <dt>{_('Soft Version')}</dt>
        <dd>{info.get('softversion')}</dd>
      </dl>
    </div>
  );
}
DeviceOverview.propTypes = propTypes;
DeviceOverview.defaultProps = defaultProps;

export default DeviceOverview;
