<h3 align="center">Rich Slack Statuses</h3>

<div align="center">

  [![Status](https://img.shields.io/github/workflow/status/bnjns/rich-slack-statuses/Lint%20&%20Test/main?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/actions/workflows/lint_test.yml) 
  [![GitHub Issues](https://img.shields.io/github/issues/bnjns/rich-slack-statuses?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/bnjns/rich-slack-statuses?style=flat-square)](https://github.com/bnjns/rich-slack-statuses/pulls)
  [![License](https://img.shields.io/github/license/bnjns/rich-slack-statuses?style=flat-square)](/license.txt)

</div>

---


<p align="center"> Allows you to automatically configure rich Slack statuses, including the emoji, text, and do not disturb and away settings.
    <br>
</p>

## 🧐 About

_TODO_

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

#### Calendars

| Environment variable |  Type  | Required | Default  | Description                                                                        |
|:---------------------|:------:|:--------:|:---------|:-----------------------------------------------------------------------------------|
| `CALENDAR_TYPE`      | string |    N     | `google` | The type of calendar to determine the status from. Currently can only be `google`. |
| `CALENDAR_ID`        | string |    Y     | N/A      | The ID of the calendar to determine the status from.                               |

#### Slack

| Environment variable |  Type  | Required | Default | Description                                                                        |
|:---------------------|:------:|:--------:|:--------|:-----------------------------------------------------------------------------------|
| `SLACK_TOKEN`        | string |    Y     | N/A     | The _User OAuth Token_ of the [Slack app](#slack-app) installed on your workspace. |

#### GCP service account

| Environment variable |  Type  | Required | Default  | Description                                                                        |
|:---------------------|:------:|:--------:|:---------|:-----------------------------------------------------------------------------------|
| `GOOGLE_CREDENTIALS` |  JSON  |    N     | N/A      | The JSON credentials of the GCP service account, if reading from Google.           |

Alternatively, you can place the JSON credentials in a `gcp-credentials.json` file, in the root of the app.

###  Running the tests

Simply run the tests using the yarn script:

```sh
yarn test
```

You can also watch for changes and automatically with:

```sh
yarn test:watch
```

### Running manually

You can run the application manually using

```sh
yarn run:local <command> [...<options>]
```

with any of the following commands:

- `clear-status`: Clear your Slack status.
- `execute`: Run the entire app flow, from reading the calendar to updating Slack.
- `set-status`: Set your Slack status, with an optional event title as a 2nd argument. For example,
  ```sh
  yarn run:local set-status ':calendar: [DND] An example event'
  ```


## 🎈 Features

### Slack app

At the moment, you will need to create your own Slack app within your workspace; simply head
to <https://api.slack.com/apps>, and click _Create New App_. You can use the [included manifest](slack_manifest.yaml) to
simply the process.

Once created, you will need to install it to the workspace; go to _Settings > Install App_ and press _Install to
Workspace_. This may require administrator approval, depending on your workspace settings.

Once installed, you can configure the `SLACK_TOKEN` variable with your _User OAuth Token_.

> **Note:** The _User OAuth Token_ is specific to a user; each user wishing to use this application will need to install
> it themselves

### Calendars

This can currently read calendars from the following:

| Type     | Details                             |
|:---------|:------------------------------------|
| `google` | [Google Calendar](#google-calendar) |

Select the desired calendar with the `CALENDAR_TYPE` environment variable (defaults to `google`).

#### Google Calendar

Ensure you have a GCP service account which has read access to the desired calendar:

- _Settings and sharing_ > _Share with specific people_
- Add the service account email with the _See all event details_ permission

The calendar can then be configured by setting the `CALENDAR_ID` environment variable.

## 🚀 Deploying

_TODO_

## ⛏️ Built Using

_TODO_

## ✍️ Authors

- [@bnjns](https://github.com/bnjns)
