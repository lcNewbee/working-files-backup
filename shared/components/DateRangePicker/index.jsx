import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const locale = b28n.getLang();

if (locale === 'en') {
  moment.locale('en-gb');
} else {
  moment.locale('zh-cn');
}

const now = moment();
if (locale === 'cn') {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

function format(v) {
  return v ? v.format('YYYY-MM-DD HH:mm:ss') : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

const TimePickerElement = (
  <TimePickerPanel
    defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
  />
);

const propTypes = {
  value: PropTypes.instanceOf(Array), // ['2017-8-31 00:00:00', '2018-9-20 23:23:23']
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
const defaultProps = {
  value: [],
  disabled: false,
};

export default class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverValue: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onHoverChange = this.onHoverChange.bind(this);
    this.renderRangeCalendar = this.renderRangeCalendar.bind(this);
  }

  onHoverChange(hoverValue) {
    this.setState({ hoverValue });
  }


  onChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  renderRangeCalendar() {
    return (
      <RangeCalendar
        style={{ width: 505 }}
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        defaultValue={[now, now.clone().add(1, 'months')]}
        locale={locale === 'en' ? enUS : zhCN}
        timePicker={TimePickerElement}
      />
    );
  }

  render() {
    const val = this.props.value.map((value) => {
      if (!moment.isMoment(value)) {
        return moment(value);
      }
      return value;
    });
    return (
      <Picker
        value={val}
        onChange={this.onChange}
        animation="slide-up"
        calendar={this.renderRangeCalendar()}
      >
        {
          ({ value }) => (
            <span>
              <input
                placeholder="please select"
                style={{ width: 274 }}
                type="text"
                disabled={this.props.disabled}
                readOnly
                className="ant-calendar-picker-input ant-input"
                value={isValidRange(value) && `${format(value[0])} ~ ${format(value[1])}`}
              />
            </span>
          )
        }
      </Picker>
    );
  }
}

DateRangePicker.propTypes = propTypes;
DateRangePicker.defaultProps = defaultProps;

