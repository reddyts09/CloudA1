# Hosting a Dynamic Website using Cloud Virtualization
Setting up a Django Application with a wsgi server 
and hosting it behind Nginx on port 80 and then deploying the saved Django application from github to AWS.

# Configuration Details:
Steps:
1. To connect to the aws cloud service:
- ssh -i key.pem ubuntu@your-aws-instance-public-ip -i key.pem

2. After logging in:
- sudo apt-get update 
- sudo apt-get install python-pip python-dev nginx git

3. Download the Django project from git:
- sudo apt-get update 
- sudo pip install virtualenv 
- git clone https://github.com/reddyts09/CloudA1.git

4. Install Django and uwsgi
- pip install django
- sudo pip install uwsgi

5. To store our config options, we need to create an ‘ini’ file which will contain all the uwsgi config details (like which virtualenv to use, where is the home folder, etc arguments we passed while executing the command to run the server).
- sudo mkdir /etc/uwsgi/sites
- sudo nano /etc/uwsgi/sites/mysite.ini
- Insert the following lines:
   '''[uwsgi]
   chdir = /home/ubuntu/CloudA1/uwsgi-tut/mysite
   home = /home/ubuntu/CloudA1/uwsgi-tut
   module = mysite.wsgi:application
   master = true
   processes = 5
   socket = /home/ubuntu/CloudA1/uwsgi-tut/mysite/mysite.sock
   chmod-socket = 666
   vacuum = true
   harakiri = 30'''
 You can test if this works by running the following command:
- uwsgi --ini /etc/uwsgi/sites/mysite.ini

6. Now we create the uwsgi.service daemon file which goes in the /etc/systemd/system directory. Insert the following lines:
[Unit]
Description=uWSGI Daemon 
After=network.target
[Service]
User=Ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/CloudA1
ExecStart=/home/ubuntu/CloudA1/uwsgi-tut/bin/uwsgi --ini /etc/uwsgi/sites/mysite.ini
Restart=always 
Type=notify
NotifyAccess=all
[Install]
WantedBy=multi-user.target

Now let’s tell the systemd to run our service:
- sudo systemctl daemon-reload 
- sudo systemctl start uwsgi 
- sudo systemctl enable uwsgi

7. Nginx config:
-sudo apt-get install nginx
-sudo service nginx start
-sudo vim /etc/nginx/sites-available/mysite_nginx.conf
Insert the following lines:
the upstream component nginx needs to connect to
upstream django {
    server unix:///home/ubuntu/CloudA1/uwsgi-tut/mysite/mysite.sock; for a file socket
    #server 127.0.0.1:8001; for a web port socket (we'll use this first)
}
configuration of the server
server {
    the port your site will be served on
    listen      80;
    the domain name it will serve for
    server_name 18.191.242.165; substitute your machine's IP address or FQDN
    charset     utf-8;
    max upload size
    client_max_body_size 75M;   adjust to taste
    Django media
    location /media  {
        root /home/ubuntu/CloudA1/uwsgi-tut/mysite/media; your Django project's media files - amend as required
    }
    location /static {
        alias /home/ubuntu/CloudA1/uwsgi-tut/mysite/static; your Django project's static files - amend as required
    }
    Finally, send all non-media requests to the Django server.
    location / {
        uwsgi_pass  django;
        include     /home/ubuntu/CloudA1/uwsgi-tut/mysite/uwsgi_params; the uwsgi_params file you installed
    }
}
We need to add this to sites-enabled directory, in order to be picked up by Nginx. We can create a symlink to the file:
- sudo ln -s /etc/nginx/sites-available/mysite_nginx.conf /etc/nginx/sites-enabled/
That’s all. Now restart nginx and you’re all set:
- sudo service nginx restart

8. You need to have allowed hosts configured to allow those domains. Edit the mysite>settings.py to accomodate the host:
- ALLOWED_HOST = ['18.191.242.165']
Add the lines below to the bottom of the file 
- STATIC_ROOT = os.path.join(BASE_DIR, "static/")

# Built With
- Django,AWS: Web Framework used
- HTML,CSS,JavaScript,Python: Web Development Applications used
- uwsgi, nginx: Servers used
* Github: repository for code

# Acknowledgements
I thank Prof.Giridhar for provding me with the opportunity to work on this project that deals with hands on experience with Cloud, AWS and Django framework.
