function npm {
  $joined = ($args | ForEach-Object { $_ }) -join ' '
  & wsl.exe -d Ubuntu -e /bin/bash -c @"
export HOME=/home/milton
NODE_BIN=`$(ls -1d /home/milton/.nvm/versions/node/v*/bin/node 2>/dev/null | sort -V | tail -1)
export PATH="`$(dirname "`$NODE_BIN"):/usr/bin:/bin"
cd /home/milton/projects/teste-seidor
npm $joined
"@
}
