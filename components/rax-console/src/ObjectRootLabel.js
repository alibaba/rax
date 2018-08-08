import { createElement } from 'rax';
import ObjectName from './ObjectName';
import ObjectPreview from './ObjectPreview';

const ObjectRootLabel = ({ name, data }) => {
  if (typeof name === 'string') {
    return (
      <span>
        <ObjectName name={name} />
        <span>: </span>
        <ObjectPreview data={data} />
      </span>
    );
  } else {
    return <ObjectPreview data={data} />;
  }
};

export default ObjectRootLabel;