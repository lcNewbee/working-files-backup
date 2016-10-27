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
  onChangeData(data) {
  }
  render() {
    const { store, app } = this.props;

    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="text"
          label={_('Nickname')}
          value={store.getIn(['data', 'alias'])}
          onChange={(option) => this.props.onChangeData({
            alias: option.value,
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
Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
