import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({
  dictInfo: global.dictInfo,
}))
export default class DictLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dictInfo, type, value, source } = this.props;
    return (
      <span>
        {source
          ? source.filter(item => item.value === value).map(item => item.label)
          : dictInfo
              .filter(item => item.type === type && item.value === value)
              .map(item => item.label)}
      </span>
    );
  }
}
