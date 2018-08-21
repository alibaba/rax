module.exports = {
  // beforeCreate: 'before-constructor',
  // created: 'after-constructor',
  beforeMount: 'componentWillMount',
  mounted: 'componentDidMount',
  beforeUpdate: 'componentWillUpdate',
  updated: 'componentDidUpdate',
  beforeDestroy: 'componentWillUnmount'
  // destroyed: 'after-componentWillMount'
};
