#!/usr/bin/env bash
set -eo pipefail

clean() {
  echo ":: Cleaning"
  rm -rf dist*
  rm -rf package
}

compile() {
  clean

  echo ":: Compiling"
  yarn --frozen-lockfile 1> /dev/null
  yarn tsc 1> /dev/null

  echo ":: Installing production dependencies"
  cp package.json dist
  cp yarn.lock dist
  pushd dist &> /dev/null
  yarn --production --frozen-lockfile 1> /dev/null
  rm package.json
  rm yarn.lock
  popd &> /dev/null
}

buildLambda() {
  compile

  echo ":: Compressing"
  pushd dist &> /dev/null
  zip -r ../dist.zip * 1> /dev/null
  popd &> /dev/null
  rm -rf dist/
}

buildPackage() {
  compile

  echo ":: Packaging"
  rm -rf package
  pkg dist/bin.js \
    -t node16-linux-x64,node16-macos-x64,node16-win-x64 \
    --out-path package
}

readonly rootDir="$(dirname $(realpath $0))/.."

pushd "${rootDir}" &> /dev/null

readonly action="${1}"
case ${action} in
  --lambda)
    buildLambda
    ;;
  --package)
    buildPackage
    ;;
  *)
    compile
    ;;
esac

popd &> /dev/null

