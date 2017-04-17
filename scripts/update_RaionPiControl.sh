echo Remove all files... &&
cd /var/www/html/ && rm -rf * && ls -A1 | xargs rm -rf &&
echo Clone new Git... &&
git clone https://github.com/mashimaroa15/RaionPiControl.git /var/www/html/ &&
echo Change ownership... &&
chown -R pi:web /var/www/html/ &&
echo Change permissions... &&
chmod -R 775 /var/www/html/ &&
cd ~
