import React, { Component } from 'react';

import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Title from './Title';
import Table from './Table';

@connect(({ index }) => ({
  pageKey: index.pageKey,
  index: index.index,
  tableOne: index.tableOne,
  tableTwo: index.tableTwo,
}))
class Ledger extends Component {
  componentDidMount() {}

  render() {
    const { pageKey, index, tableOne, tableTwo } = this.props;
    return (
      <PageHeaderWrapper key={pageKey}>
        <div className="pageContainer">
          <Title index={index} />
          <Table tableOne={tableOne} tableTwo={tableTwo} />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Ledger;
