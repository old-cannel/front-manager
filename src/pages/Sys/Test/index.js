import { Component } from 'react';

import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import List from './List';

@connect(({ systest }) => ({
  pageKey: systest.pageKey,
}))
class Ledger extends Component {
  componentDidMount() {}

  render() {
    const { pageKey } = this.props;
    return (
      <PageHeaderWrapper key={pageKey}>
        <List />
      </PageHeaderWrapper>
    );
  }
}

export default Ledger;
