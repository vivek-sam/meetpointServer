trap "exit" INT TERM ERR
trap "kill 0" EXIT

node server.js &
tail -f ../working/log/*server*.log

wait
