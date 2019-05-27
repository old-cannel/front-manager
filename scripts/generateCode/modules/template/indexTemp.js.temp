import React,{ Component } from 'react';
#{IMPORTANTD}
#{IMPORTDYNAMIC}
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import List from './List';

@connect(({ #{NAMESPACE} }) => ({
  pageKey: #{NAMESPACE}.pageKey,
}))
class Ledger extends Component {
  componentDidMount() {
  }

  render() {
    const { pageKey } = this.props;
    return (
      <PageHeaderWrapper key={pageKey}>
        <List/>
      </PageHeaderWrapper>
    );
  }
}

export default Ledger;
