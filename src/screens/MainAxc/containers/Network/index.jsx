import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Button, SaveButton } from 'shared/components/Button';
import validator from 'shared/validator';
import Nav from 'shared/components/Nav';
import Modal from 'shared/components/Modal';
import Icon from 'shared/components/Icon';
import { FormGroup } from 'shared/components/Form';
import Table from 'shared/components/Table';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import { getActionable } from 'shared/axc';
import { actions as appActions } from 'shared/containers/app';
import { actions as propertiesActions } from 'shared/containers/properties';
import * as mainActions from '../../actions';

const validOptions = fromJS({
  groupname: validator({
    rules: 'utf8Len:[1, 31]',
  }),
  remark: validator({
    rules: 'utf8Len:[1, 255]',
  }),
  apmac: validator({
    rules: 'mac',
  }),
  name: validator({
    rules: 'required',
  }),
  model: validator({
    rules: '',
  }),
});

const propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }),
  toggleMainNav: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

class MainNetwork extends React.PureComponent {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'sss',
    ]);
  }
  render() {
    const { route } = this.props;
    return (
      <div>
        <div className="t-main__nav">
          <Nav
            role="tree"
            menus={route.routes}
            location={this.props.location}
            onChange={this.onClickNav}
            isTree
          />

        </div>
        <div className="t-main__nav-toggle" onClick={this.props.toggleMainNav} >
          <Icon name="caret-left" />
        </div>
        <div className="t-main__content">
          <RouteSwitches
            routes={route.routes}
          />
        </div>
      </div>
    );
  }
}

MainNetwork.propTypes = propTypes;
MainNetwork.defaultProps = defaultProps;

export default MainNetwork;

function mapStateToProps(state) {
  return {
    app: state.app,
    product: state.product,
    properties: state.properties,
    vlanid: state.product.getIn(['vlan', 'selected', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    propertiesActions,
    mainActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(MainNetwork);
