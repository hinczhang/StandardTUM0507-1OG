#!/bin/bash
npm run build
docker rm -f mapstats
docker run -it -d --rm -p 8085:80 --name mapstats -v $PWD/dist:/usr/share/nginx/html --privileged=true nginx
