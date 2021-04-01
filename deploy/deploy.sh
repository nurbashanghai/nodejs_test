#!/bin/bash

# any future command that fails will exit the script
set -e

# just checking
echo "$AWS_ACCESS_KEY"

# Lets write the public key of our aws instance
# eval $(ssh-agent -s)
# echo "$AWS_ACCESS_KEY" | tr -d '\r' | ssh-add - > /dev/null


# ** Alternative approach
echo "$AWS_ACCESS_KEY" > sshkey.pem
chmod 600 sshkey.pem
# ** End of alternative approach


# just checking
echo "ADDED SSH KEY"

# disable the host key checking.
chmod +rx ./deploy/disableHostKeyChecking.sh
./deploy/disableHostKeyChecking.sh

# we have already setup the DEPLOYER_SERVER in our gitlab settings which is a
# comma seperated values of ip addresses.
DEPLOY_SERVERS=$AWS_INSTANCE_DEV

# lets split this string and convert this into array
# In UNIX, we can use this commond to do this
# ${string//substring/replacement}
# our substring is "," and we replace it with nothing.
ALL_SERVERS=(${DEPLOY_SERVERS//,/ })
echo "ALL_SERVERS ${ALL_SERVERS}"

# Lets iterate over this array and ssh into each EC2 instance
# Once inside the server, run updateAndRestart.sh
for server in "${ALL_SERVERS[@]}"
do
  echo "deploying to ${server}"
  echo "copying env"
  echo "$DOTENV_DEV" > .env
  cat .env
  cat sshkey.pem
  scp -i sshkey.pem .env ec2-user@ec2-3-14-82-27.us-east-2.compute.amazonaws.com:/home/ec2-user/
  scp -r -i sshkey.pem dist ec2-user@ec2-3-14-82-27.us-east-2.compute.amazonaws.com:/home/ec2-user/
  echo "copied env"
  ssh -i sshkey.pem ec2-user@${server} 'bash' < ./deploy/updateAndRestart.sh
done
