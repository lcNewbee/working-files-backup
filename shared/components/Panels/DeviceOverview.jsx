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
  const { store } = props;
  return (
    <div className="m-description-list">
      <dl className="m-description-list-row">
        <dt>{_('MAC Address')}</dt>
        <dd>{store.getIn(['data', 'mac'])}</dd>
      </dl>
      <dl className="m-description-list-row">
        <dt>{_('Model')}</dt>
        <dd>{store.getIn(['data', 'model'])}</dd>
      </dl>
      <dl className="m-description-list-row">
        <dt>{_('Version')}</dt>
        <dd>{store.getIn(['data', 'version'])}</dd>
      </dl>
    </div>
  );
}
DeviceOverview.propTypes = propTypes;
DeviceOverview.defaultProps = defaultProps;

export default DeviceOverview;
