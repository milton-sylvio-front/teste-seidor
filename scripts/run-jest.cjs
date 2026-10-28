const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const jestBin = path.join(projectRoot, 'node_modules', 'jest', 'bin', 'jest.js')
const extraArgs = process.argv.slice(2)
const wslProject = '/home/milton/projects/teste-seidor'
const nvmNodesDir = '/home/milton/.nvm/versions/node'

function exitWith(result) {
  process.exit(result.status === null ? 1 : result.status)
}

function nodeMajorFromPath(filePath) {
  const match = filePath.match(/[\\/]v(\d+)\./)
  return match ? Number(match[1]) : 0
}

function compatibleLinuxNodes() {
  if (!fs.existsSync(nvmNodesDir)) {
    return []
  }

  return fs
    .readdirSync(nvmNodesDir)
    .map((version) => path.posix.join(nvmNodesDir, version, 'bin', 'node'))
    .filter((file) => fs.existsSync(file) && nodeMajorFromPath(file) >= 18)
    .sort((a, b) => nodeMajorFromPath(b) - nodeMajorFromPath(a))
}

function runJest(nodeExecutable) {
  const result = spawnSync(nodeExecutable, [jestBin, ...extraArgs], {
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
        `[ -n "$NODE_BIN" ] || { echo "Node.js 18+ nao encontrado no WSL." >&2; exit 1; }`,
        'export PATH="$(dirname "$NODE_BIN"):/usr/bin:/bin"',
        `cd ${wslProject}`,
        `"$NODE_BIN" ./scripts/run-jest.cjs ${quotedArgs}`,
      ].join('; '),
    ],
    { stdio: 'inherit' },
  )
  exitWith(result)
}

const currentMajor = Number(process.versions.node.split('.')[0])
if (currentMajor < 18) {
  const nextNode = compatibleLinuxNodes()[0]
  if (nextNode) {
    const result = spawnSync(nextNode, [__filename, ...extraArgs], {
      stdio: 'inherit',
      cwd: wslProject,
    })
    exitWith(result)
  }

  console.error(
    'Este projeto precisa de Node.js 18 ou superior para executar os testes com Jest.',
  )
  process.exit(1)
}

runJest(process.execPath)
