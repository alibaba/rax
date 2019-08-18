const promptQuestion = [
  {
    type: 'list',
    name: 'projectType',
    message: 'What\'s your project type?',
    choices: [
      {
        name: 'App (Build application that works multi-platform)',
        value: 'scaffold'
      },
      {
        name: 'Component (Build component for application include web)',
        value: 'component'
      },
      {
        name: 'API (Build universal API library)',
        value: 'api'
      }
    ],
    default: 'scaffold'
  },
  {
    type: 'checkbox',
    name: 'projectTargets',
    when: function(answers) {
      return answers.projectType === 'scaffold' || answers.projectType === 'component';
    },
    validate: function(targets) {
      if (targets && targets.length > 0) return true;
      return 'Choose at least one of target.';
    },
    message: 'Do you want to build to these targets?',
    choices: [
      {
        name: 'web',
        value: 'web'
      },
      {
        name: 'weex',
        value: 'weex'
      },
      {
        name: 'miniapp',
        value: 'miniapp'
      }
    ],
    default: false
  },
  {
    type: 'checkbox',
    name: 'projectFeatures',
    when: function(answers) {
      return answers.projectType === 'scaffold' && answers.projectTargets.includes('web');
    },
    message: 'Do you want to enable these features?',
    choices: [
      {
        name: 'server sider rendering (ssr)',
        value: 'ssr'
      }
    ],
    default: false
  },
  {
    type: 'input',
    name: 'projectAuthor',
    message: 'What\'s author\'s name?',
    default: 'rax'
  },
  {
    type: 'confirm',
    name: 'autoInstallModules',
    message: 'Do you want to install dependences automatically after initialization?',
    default: 'y'
  }
];

module.exports = {
  promptQuestion,
};
