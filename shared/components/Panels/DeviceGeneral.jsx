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
  actionable: PropTypes.bool,
};

const defaultProps = {
};
class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
  render() {
    const { store, app, actionable } = this.props;
    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="text"
          label={_('Nickname')}
          value={store.getIn(['data', 'devicename'])}
          onChange={option => this.props.onChangeData({
            devicename: option.value,
          })}
        />
        {
          actionable ? (
            <SaveButton
              size="sm"
              loading={app.get('saving')}
              onClick={this.onSave}
            />
          ) : null
        }
      </div>
    );
  }
}
Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
