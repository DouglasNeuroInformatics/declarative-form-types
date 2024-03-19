// @ts-check

const preset = 'conventionalcommits';

/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset }],
    ['@semantic-release/release-notes-generator', { preset }],
    ['@semantic-release/changelog', { changelogTitle: 'Changelog' }],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'dist'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.tgz'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ],
  repositoryUrl: 'https://github.com/DouglasNeuroInformatics/libui-form-types.git',
  tagFormat: 'v${version}'
};
