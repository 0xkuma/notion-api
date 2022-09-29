import { Client } from '@notionhq/client';
import { addItem, queryDB, updateItem, queryItem } from './notion-controller';
import * as dotenv from 'dotenv';
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const taskDatabaseId = process.env.NOTION_TASK_DATABASE_ID!;
const masterListDatabaseId = process.env.NOTION_MASTER_LIST_DATABASE_ID!;
const clientProfileDatabaseId = process.env.NOTION_CLIENT_PROFILE_DATABASE_ID!;

const getAllTaskId = async () => {
  const res = await queryDB(notion, masterListDatabaseId);
  return res?.results.map((item) => item.id)!;
};

const getAllClientId = async () => {
  const res = await queryDB(notion, clientProfileDatabaseId, {
    property: 'isTaskCreated',
    checkbox: {
      equals: false,
    },
  });
  return res?.results.map((item) => item.id)!;
};

const getAllTaskIdCreatedByClientId = async (clientId: string) => {
  const getAllTaskIdRes = await queryDB(notion, taskDatabaseId, {
    property: 'AWS ID',
    rollup: {
      every: {
        property: 'AWS ID',
        rich_text: {
          equals: clientId,
        },
      },
    },
  });
  let existTaskId: string[] = [];
  for(let i = 0; i < getAllTaskIdRes?.results.length!; i++) {
    const res = await queryItem(notion, getAllTaskIdRes?.results[i].id!);
    existTaskId.push(res?.properties['Task Full Name'].relation[0].id!);
  }
  return existTaskId;
};

export const handler = async (event: any) => {
  const clientIdList = await getAllClientId();
  const taskIdList = await getAllTaskId();

  clientIdList.map((clientId) => {
    taskIdList.map((taskId) => {
      addItem(notion, taskDatabaseId, clientId, taskId);
    });
    updateItem(notion, clientId, {
      isTaskCreated: {
        checkbox: true,
      },
    });
  });
};
handler(null);
