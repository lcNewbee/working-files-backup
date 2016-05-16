import './index.scss';
import React, {PropTypes} from 'react';

const propTypes = {
  role: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
};

const defaultProps = {
  role: 'button',
};

class Switchs extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  };
  
  onClick(e) {
    if(e.target.value) {
      this.props.onChange({
        value: e.target.value,
        label: e.target.innerHTML
      });
    }
  };
  
  render() {
    let {role, size, className, options, value} = this.props;
    
    let classNames = 'btn-group';
    
    if (size) {
      classNames = `${classNames} btn-${size}`;
    }
    
    if (className) {
      classNames = className + ' ' + classNames;
    }
    
    return (
      <div
        className={classNames}
        onClick={this.onClick}
      >
        {
          options ? options.map((item, i) => {
            let myClassName = 'btn';
            let val, label;
            
            if(item.get) {
              val = item.get('value');
              label = item.get('label');
            } else {
              val = i;
              label = item;
            }
            
            if(item.get('value') === value) {
              myClassName += ' active';
            }
            
            return (
              <button
                key={i}
                className={myClassName}
                value={val}
              >
                {label}
              </button>
            );
          }) : null
        }
      </div>
    );
  }
}

Switchs.propTypes = propTypes;
Switchs.defaultProps = defaultProps;

export default Switchs;