# DiscordJS + EC2 Management

DiscordJS Bot capable to manage (run/stop/describe/etc) AWS EC2 Instances.

## Production Deployment Setup

To deploy the source code into an EC2 (t2.micro) instance you can use ready-to-use yml templates to deliver using AWS CLI & CloudFormation API:

- Create `account-vpc-id`, `djsbot-controle-instanceid` (Instance to be controlled) and `djsbot-secret`(Discord given bot's secret token) paramaters into AWS SSM Parameter Store Console.

- In case you decided to fork this project you should update `BotPublicRepo` parameter inside `instance.yml` template.

- Create `discord-bot` KeyPair in your EC2 Console.

- Grant excecution permissions up to deployment scripts using `chmod +x deployment/deploy.sh` then run `sh deployment/deploy.sh`.

- A Discord bot is running on a dedicated server!

## Development Setup

Install dependencies:
`npm install`

Run via nodemon:
`npm run start:dev`
