#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)

function printHelp() {
  console.log(`
  planview — local MDX plan viewer

  Usage:
    npx planview [options]

  Options:
    --dir <path>    Directory containing .mdx plan files (default: current directory)
    --port <port>   Port to listen on (default: 3000)
    -h, --help      Show this help message

  Examples:
    npx planview --dir ./plans
    npx planview --dir /absolute/path/to/plans --port 4000
`)
}

if (args.includes('-h') || args.includes('--help')) {
  printHelp()
  process.exit(0)
}

let dirArg = null
let portArg = '3000'

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) {
    dirArg = args[++i]
  } else if (args[i] === '--port' && args[i + 1]) {
    portArg = args[++i]
  }
}

// Resolve plans directory relative to where the user ran npx from
const invokedFrom = process.env.INIT_CWD || process.cwd()
const plansDir = dirArg
  ? path.resolve(invokedFrom, dirArg)
  : invokedFrom

if (!fs.existsSync(plansDir)) {
  console.error(`\n  Error: plans directory not found: ${plansDir}\n`)
  process.exit(1)
}

const pkgRoot = path.resolve(__dirname, '..')
const serverScript = path.join(pkgRoot, '.next', 'standalone', 'server.js')

if (!fs.existsSync(serverScript)) {
  console.error(`
  Error: planview has not been built yet.

  Run the following inside the planview package directory:

    npm run build

  Then re-run planview.
`)
  process.exit(1)
}

// Static assets from the standalone build need to be served from the right place.
// Next.js standalone server reads NEXT_PUBLIC_* and the static dir from the build root.
const standaloneDir = path.dirname(serverScript)

console.log(`\n  planview\n`)
console.log(`  Plans: ${plansDir}`)
console.log(`  URL:   http://localhost:${portArg}\n`)

const env = {
  ...process.env,
  PLANS_DIR: plansDir,
  PORT: portArg,
  HOSTNAME: '0.0.0.0',
  // Tell Next.js standalone server where to find static assets
  NEXT_SHARP_PATH: path.join(standaloneDir, 'node_modules', 'sharp'),
}

const child = spawn(process.execPath, [serverScript], {
  cwd: standaloneDir,
  env,
  stdio: 'inherit',
})

child.on('error', (err) => {
  console.error('\n  Error starting planview:', err.message, '\n')
  process.exit(1)
})

child.on('close', (code) => {
  process.exit(code ?? 0)
})

process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
