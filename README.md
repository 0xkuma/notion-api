# Notion API

This project is for MSP team to auto generate all task for each client

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

## Requirement

~~For the Client Profile page, it needs the add column name **"isTaskCreated"** and the type is **"Checkbox"**. This column is used to check whether created the task~~

## Installation

Follow the document to install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

Install requirement package

```sh
yarn install
```

## Prepare step

1. Create a new integrations to get the notion api key
   [Notion Developers](https://www.notion.so/my-integrations)
1. Connect **Task**, **Client Profile** and **Task Master List** to integrations
1. Setup the environment variable

```sh
export NOTION_KEY=""
export NOTION_TASK_DATABASE_ID=""
export NOTION_MASTER_LIST_DATABASE_ID=""
export NOTION_CLIENT_PROFILE_DATABASE_ID=""
```

## Run command

```sh
yarn tsc && node dist/index.js
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
