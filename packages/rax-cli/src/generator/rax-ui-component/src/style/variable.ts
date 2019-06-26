function VariableMix(theme: any) {
  const core = theme.Core;
  const ComponentCustomVariables = theme.Hello || {};

  /**
   * TODO
   * @namespace component
   * @property module TODO NAME
   * @property category component
   */
  const variables = {
     /**
     * color
     * @property namespace statement/normal
     */
    color: core['color-brand1-6'],
  }

  Object.assign(variables, ComponentCustomVariables);

  return variables;
}

export default VariableMix;
