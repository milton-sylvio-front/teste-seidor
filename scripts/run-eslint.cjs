const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const eslintBin = path.join(projectRoot, 'node_modules', 'eslint', 'bin', 'eslint.js')
const extraArgs = process.argv.slice(2)
const wslProject = '/home/milton/projects/teste-seidor'
const nvmNodesDir = '/home/milton/.nvm/versions/node'

function exitWith(result) {
  process.exit(result.status === null ? 1 : result.status)
}

function parseNodeVersion(value) {
  const match = String(value).match(/(\d+)\.(\d+)\.(\d+)/)
  if (!match) {
    return null
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function supportsEslint(version) {
  if (!version) {
    return false
  }

  if (version.major === 20) {
    return version.minor >= 19
  }

  if (version.major === 22) {
    return version.minor >= 13
  }

  return version.major >= 24
}

function compareVersions(left, right) {
  return (
    right.major - left.major || right.minor - left.minor || right.patch - left.patch
  )
}

function compatibleLinuxNodes() {
  if (!fs.existsSync(nvmNodesDir)) {
    return []
  }

  return fs
    .readdirSync(nvmNodesDir)
    .map((version) => ({
      executable: path.posix.join(nvmNodesDir, version, 'bin', 'node'),
      version: parseNodeVersion(version),
    }))
    .filter(
      (entry) => fs.existsSync(entry.executable) && supportsEslint(entry.version),
    )
    .sort((left, right) => compareVersions(left.version, right.version))
    .map((entry) => entry.executable)
}

function runEslint(nodeExecutable) {
  const result = spawnSync(nodeExecutable, [eslintBin, ...extraArgs], {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      PATH: `${path.dirname(nodeExecutable)}${path.delimiter}${process.env.PATH || ''}`,
    },
  })
  exitWith(result)
}

if (process.platform === 'win32') {
  const quotedArgs = extraArgs
    .map((arg) => `'${String(arg).replace(/'/g, `'\\''`)}'`)
    .join(' ')
  const result = spawnSync(
    'wsl.exe',
    [
      '-d',
      'Ubuntu',
      '-e',
      '/bin/bash',
      '-c',
      [
        'export HOME=/home/milton',
        'NODE_BIN=$(ls -1d /home/milton/.nvm/versions/node/v*/bin/node 2>/dev/null | sort -V | tail -1)',
        `[ -n "$NODE_BIN" ] || { echo "Node.js compativel com ESLint nao encontrado no WSL." >&2; exit 1; }`,
        'export PATH="$(dirname "$NODE_BIN"):/usr/bin:/bin"',
        `cd ${wslProject}`,
        `"$NODE_BIN" ./scripts/run-eslint.cjs ${quotedArgs}`,
      ].join('; '),
    ],
    { stdio: 'inherit' },
  )
  exitWith(result)
}

if (!supportsEslint(parseNodeVersion(process.versions.node))) {
  const nextNode = compatibleLinuxNodes()[0]
  if (nextNode) {
    const result = spawnSync(nextNode, [__filename, ...extraArgs], {
      stdio: 'inherit',
      cwd: wslProject,
    })
    exitWith(result)
  }

  console.error(
    'ESLint 10 precisa de Node.js ^20.19.0, ^22.13.0 ou >=24.',
  )
  process.exit(1)
}

runEslint(process.execPath)
