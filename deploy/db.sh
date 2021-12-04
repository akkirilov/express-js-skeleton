#!/bin/bash

# USAGE
# sudo bash db.sh user pass database host

mysql -e "CREATE USER IF NOT EXISTS '$1'@'$4' IDENTIFIED BY '$2';"
mysql -e "CREATE DATABASE IF NOT EXISTS $3"
mysql -e "GRANT ALL PRIVILEGES ON *.* TO '$1'@'$4';"
mysql -e "FLUSH PRIVILEGES;"
