sudo dnf remove ufw

systemctl disable firewalld;
systemctl enable firewalld;

systemctl start firewalld;
systemctl stop firewalld;
