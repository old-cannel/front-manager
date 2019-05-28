import React from 'react';
import styles from './FilterItem.less';

const FilterItem = ({ type = '', label = '', children }) => {
  const labelArray = label.split('');
  let filterWidth = { width: 330 };

  switch (type) {
    case 'rangePicker':
      filterWidth = { width: 480 };
      break;
    case 'button':
      filterWidth = { width: 200 };
      break;
    default:
      break;
  }

  return (
    <div style={filterWidth} className={styles.filterItem}>
      {labelArray.length > 0 ? (
        <div className={styles.labelWrap}>
          {labelArray.map(item => (
            <span className="labelText" key={Math.random()}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        ''
      )}
      <div className={styles.item}>{children}</div>
    </div>
  );
};

export default FilterItem;
