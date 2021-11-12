rm /etc/redis/redis.conf 2> /dev/null
cp /var/www/svv-handball/redis.conf /etc/redis/
systemctl restart redis
systemctl status redis
