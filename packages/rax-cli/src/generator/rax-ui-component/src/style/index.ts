import VariableMix from './variable';

export default (theme: any) => {
  const variables = VariableMix(theme);

  return {
    'hello': {
      color: variables.color,
      fontSize: '20px'
    }
  };
}
