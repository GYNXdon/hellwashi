Welcome to hell..

From a new instance (starting fresh)

1. Update apt:
```
sudo apt update
```
2. Install git:
```
sudo apt install git
```
3. Install node:
```
sudo apt install nodejs
```
4. Install npm
```
sudo apt install npm
```
5. Install pm2:
```
sudo npm install pm2@latest -g
```
6. Upgrade nodejs:
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash - 
sudo apt install -y nodejs
```
7. Install Nginx:
```
sudo apt install nginx
```
8. Clone the repo: (replace with your repo)
```
git clone https://github.com/GYNXdon/hellwashi.git

Install dependencies: (Replace with your folder)
```
cd nawashi
npm install

9. Update nginx file:
```
cd /etc/nginx/sites-available

sudo nano default
```
Update with this content
```
# before root
# before index
```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    location / {
        proxy_pass http://localhost:3001;
    }
}
```
Remove
try_files $uri $uri/ =404
```
To exit and save:
```
Ctrl + X --> Y

10. Test to make sure there is no error:

```
sudo nginx -t
```

Restart Nginx:

```
sudo systemctl restart nginx

11. Test that server.js is working
---
cd
cd hellwashi
node server.js
---
NOTE ! You may have a few errors here. A few potential fixes were making sure the package.json file dpendencys versions match up with the project versions. 
Using the npm list express command for example will show you the version that the project is using same for npm list body-parser.
Also you should upgrade Node to the latest version and run version checks on all the dependencies to troubleshoot any errors you may be getting.

Eventually you should be able to node server.js from cd hellwashi and run the server, then you can send payload buy or sell orders to the instance ip/webhook
and see in the terminal, any order recieved or order errors from the payloads and or the Trading View Alerts. 

if you have any erros make sure all the java script and Ku coin modules are all installed correctly and check the versions and update if nessary and that should be enough to
get node server.js running. 
I did stay up last night 15/04/23 from 10pm till 4 am trouble shooting the errors and eventually got the server running and recieving orders, now i have to troubleshoot
the order error codes.... 

Note dont run the server with pm2 i cant get it to work. Ip will onlt show a webpage when server.js is running 

