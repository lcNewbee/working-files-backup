import React from 'react';
import Navbar from 'shared/components/Navbar';
import { connect } from 'react-redux';


export default class ThinModeNotice extends React.Component {

  render() {
    const { version, guiName } = this.props.app.toJS();

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        />
        <div className="t-wizard">
          <h2>{_('Thin Mode Notice')}</h2>
          <div
            className="t-wizard__content"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'green',
            }}
          >
            { "somethings" }
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export const Screen = connect(
  mapStateToProps
)(ThinModeNotice);
