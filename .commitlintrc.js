module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // Monorepo workspaces
        'web',
        'mobile',
        'shared',
        'ui',
        'docs',
        
        // Supabase areas
        'supabase',
        'functions',
        'migrations',
        'seed',
        
        // Project areas
        'tools',
        'scripts',
        'design-assets',
        'github',
        
        // Infrastructure
        'deps',
        'config',
        'ci',
        'build',
        'lint',
        'test',
        
        // Release and maintenance
        'release',
        'monorepo'
      ]
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ]
  }
};