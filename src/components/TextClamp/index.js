import { Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;
const TextClamp = ({ children, width = 200, rows = 2 }) => {
  return (
    <Paragraph title={children} style={{ maxWidth: width }} ellipsis={{ rows }}>
      {children}{' '}
    </Paragraph>
  );
};
export default TextClamp;
