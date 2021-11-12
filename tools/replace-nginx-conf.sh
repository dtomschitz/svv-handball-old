rm /etc/nginx/nginx.conf 2> /dev/null
cp /var/www/svv-handball/nginx.conf /etc/nginx/
systemctl restart nginx
systemctl status nginx

