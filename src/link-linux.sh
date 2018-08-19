#!/bin/bash
set -e

projdir=$1
buildcmd=$2
mustbuild=$3
mustlink=$4

if [[ -z "$projdir" || -z "$buildcmd" || -z "$mustbuild" || -z "$mustlink" ]]; then
  echo Invalid args. Pass the projectdir, buildcmd, mustbuild and mustlink as params to this script.
fi

cd "$projdir"
temptarfile=`mktemp`
tar --mtime='1970-01-01' --exclude='./node_modules' --exclude='./.git' --exclude='./wireman.md5' -cf $temptarfile .

build_app () {
  projmd5=$1
  yarn
  $buildcmd
  if [[ "$mustlink" == "link" ]]; then
    yarn link
  fi
  echo projmd5 > wireman.md5
}

if [ ! -f wireman.md5 ]; then
  md5=`md5sum $temptarfile | basho 'x.split(/\s+/)[0]'`
  build_app md5
else
  oldmd5=`cat wireman.md5`
  newmd5=`md5sum ${temptarfile} | basho 'x.split(/\s+/)[0]'`

  # Do we have changes?
  if [[ ! "$oldmd5" == "$newmd5" || "$mustbuild" == "buildalways" ]]; then
    build_app newmd5
  fi
fi