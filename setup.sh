#!/bin/bash

case "$1" in
        start)
                echo "Start..."
                docker-compose up -d
                ;;
        stop)
                echo "Stop..."
                docker-compose stop
                ;;
        build)
                echo "Build..."
                docker-compose build --no-cache
                ;;
        update)
                echo "Update..."
                docker-compose stop
                git pull origin master
                docker-compose build --no-cache
                docker-compose up -d
                ;;
        *)
                echo $"Usage: $0 {start|stop|build|update}"
                exit 1

esac