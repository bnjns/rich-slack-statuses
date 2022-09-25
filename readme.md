<h3 align="center">Rich Slack Statuses</h3>

<div align="center">

  [![Status](https://img.shields.io/github/workflow/status/bnjns/rich-slack-statuses/test/main?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/actions/workflows/test.yml) 
  [![GitHub Issues](https://img.shields.io/github/issues/bnjns/rich-slack-statuses?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/bnjns/rich-slack-statuses?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/pulls)
  [![License](https://img.shields.io/github/license/bnjns/rich-slack-statuses?style=flat-square)](/license.txt)

</div>

---


<p align="center"> Allows you to automatically configure rich Slack statuses, including the emoji, text, and do not disturb and away settings.
    <br>
</p>

## 🧐 About

For companies that use Slack for communication, your status is an extremely powerful tool to help let others know your
availability and set expectations on how quickly you might reply. However, manually maintaining an accurate status in a
busy working environment is practically impossible. While there are existing integrations for syncing your status to a
calendar (eg, the Google Calendar app), these are quite limited as they do not let you customise your status.

With Rich Slack Statuses, you can customise all aspects of your Slack status using a standard Calendar:

- Status text
- Status emoji
- Do not disturb (aka snooze) setting
- Presence (away/online) setting

This works by finding all active events and parsing the title:

- The status emoji is set by specifying the emoji name in the event summary, surrounded by `:` (eg, `:no_entry:`). If no
  emoji is found, this defaults to `calendar`.
- Enter the `[DND]` flag to enable Do Not Disturb (snooze). This will also automatically set the emoji to `:no_entry:`,
  unless another emoji is explicitly provided.
- Enter the `[AWAY]` flag to set the presence to `away`, otherwise the presence is set to `auto` which uses your
  activity to mark you as online/away.
- The event summary is used to set the status text, with any parsed info (eg, emoji, flags) removed.

The active event is currently determined by finding all events that are currently occurring, and selecting the event
which started last and then ends first.

## 🏁 Getting Started

### Prerequisites

- Nodejs 14.14+
- Yarn 1
- GCP service account (required to read from a Google Calendar)
- [Slack app](#slack-app)

### Installing

Clone the repository:

```sh
git clone git@github.com:bnjns/rich-slack-statuses.git
```

Install dependencies:

```sh
yarn install
```

### Configuring

There are 2 types of properties that can be configured:

- **Normal:** Configured via environment variables; the value of the config property is the value of the environment
  variable.
- **Secret:** For sensitive values (eg, credentials). Instead of containing the value, the environment variable will
  contain the location of the secret (eg, for AWS Secrets Manager it would contain the ARN of the secret).
  See [Secrets](#secrets) for more details.

| Config Property      |  Type  | Required | Default  | Description                                                                                                                  |
|:---------------------|:------:|:--------:|:---------|:-----------------------------------------------------------------------------------------------------------------------------|
| `SECRET_TYPE`        | Normal |    N     | `env`    | The system to use to resolve secrets. See [Secrets](#secrets).                                                               |
| `CALENDAR_TYPE`      | Normal |    N     | `google` | The type of calendar to use to determine the status. See [Calendars](#calendars).                                            |
| `CALENDAR_ID`        | Normal |    Y     | N/A      | The ID of the calendar to determine the status from.                                                                         |
| `SLACK_TOKEN`        | Secret |    Y     | N/A      | The _User OAuth Token_ of the [Slack app](#slack-app) installed on your workspace.                                           |
| `GOOGLE_CREDENTIALS` | Secret |    N     | N/A      | The JSON credentials of the GCP service account, if reading from Google. Alternatively, use the `gcp-credentials.json` file. |

### Running the tests

Simply run the tests using the yarn script:

```sh
yarn test
```

You can also watch for changes and automatically with:

```sh
yarn test:watch
```

View the current test coverage:

```sh
yarn test:coverage
```

### Running manually

You can run the application manually using

```sh
yarn run:local <command> [...<options>]
```

with any of the following commands:

- `clear-status`: Clear your Slack status.
- `execute`: Run the entire app flow, from reading the calendar to updating Slack.
- `get-events`: Prints the currently active events. The calendar ID can be provided as a 2nd argument, or use
  the `CALENDAR_ID` environment variable.
- `set-status`: Set your Slack status, with an optional event title as a 2nd argument. For example,
  ```sh
  yarn run:local set-status ':calendar: [DND] An example event'
  ```

### Building

To transpile the Typescript into CommonJS (will be written to `./dist`):

```sh
yarn build
```

To build this into a zip which includes all dependencies:

```sh
yarn build:lambda
```

You can also build this into an executable (eg, if you wish to run locally on a cron job):

```sh
yarn build:package
```

> This requires that you have [pkg](https://github.com/vercel/pkg) and a valid Node.js runtime installed.

## 🎈 Features

### Slack app

At the moment, you will need to create your own Slack app within your workspace; simply head
to <https://api.slack.com/apps>, and click _Create New App_. You can use the [included manifest](slack_manifest.yaml) to
simply the process.

Once created, you will need to install it to the workspace; go to _Settings > Install App_ and press _Install to
Workspace_. This may require administrator approval, depending on your workspace settings.

Once installed, you can configure the `SLACK_TOKEN` variable with your _User OAuth Token_.

> **Note:** The _User OAuth Token_ is specific to a user; each user wishing to use this application will need to install
> it themselves.

### Calendars

This can currently read calendars from the following:

- `google`: Google Calendar

Select the desired calendar with the `CALENDAR_TYPE` environment variable (defaults to `google`).

#### Google Calendar

Ensure you have a GCP service account which has read access to the desired calendar, and set the JSON credentials in
either the `GOOGLE_CREDENTIALS` secret or a `gcp-credentials.json` file.

- _Settings and sharing_ > _Share with specific people_
- Add the service account email with the _See all event details_ permission

The calendar can then be configured by setting the `CALENDAR_ID` environment variable.

### Secrets

This app has different methods for retrieving secrets, such as the Slack token, depending on your desired config and
deployment method; simply set the `SECRET_TYPE` environment variable to the desired method:

- `env`: Use environment variables. The secret name is the environment variable name. Not recommended in production.

### Predefined configurations

To make it easier to configure your status, this comes with a series of "predefined" configurations, which match on the
event summary text (case-insensitive) to automatically set the emoji:

| Text         |     Emoji     |
|:-------------|:-------------:|
| 1:1          |  `no_entry`   |
| A/L          | `palm_tree `  |
| Bank holiday | `palm_tree `  |
| Focus time   |  `no_entry`   |
| Interview    | `interview`\^ |
| Jira         |   `jira2`\^   |
| Out of hours |     `zzz`     |
| Travelling   |     `car`     |

^ This is a custom emoji

> **Note:** You can still override the emoji by specifying it in the event summary.

## 🚀 Deploying

### Deploying in the cloud

This application is designed to be deployed in a cloud serverless environment (eg, AWS Lambda) as a CommonJS module, and
can simply be run using a CRON schedule (eg, every minute). You can build this into a zip using the included script:

```sh
yarn build:lambda
```

You can then configure the handler based on the deployment platform chosen:

| Platform   | Handler                                                              |
|:-----------|:---------------------------------------------------------------------|
| AWS Lambda | `entrypoints/aws-lambda.default` or `entrypoints/aws-lambda.handler` |

### Deploying locally

If you do not wish to deploy to a cloud service you can also run this locally, using something like crontab. Simply
configure the cron job to run `yarn run:local execute`, or use `yarn build:package` to build an executable.

## 🎉 Roadmap

- [x] Reading from Google Calendar
- [ ] Ability to force override the selected event
- [ ] Ability to set secrets from AWS SSM
- [ ] Ability to set secrets from AWS Secrets Manager

## ⛏️ Built Using

- [Google Calendar API](https://github.com/googleapis/google-api-nodejs-client)
- [Slack Web API](https://github.com/slackapi/node-slack-sdk)
- [Luxon](https://github.com/moment/luxon)
- [Winston](https://github.com/winstonjs/winston)
- [pkg](https://github.com/vercel/pkg)

## ✍️ Authors

- [@bnjns](https://github.com/bnjns)
