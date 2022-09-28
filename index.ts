import { Client} from '@notionhq/client';
import { addItem, queryDB, updateItem } from './notion-controller';
import * as dotenv from 'dotenv';
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const taskDatabaseId = process.env.NOTION_TASK_DATABASE_ID!;
const masterListDatabaseId = process.env.NOTION_MASTER_LIST_DATABASE_ID!;
const clientProfileDatabaseId = process.env.NOTION_CLIENT_PROFILE_DATABASE_ID!;

const getAllTaskID = async () => {
  const res = await queryDB(notion, masterListDatabaseId);
  return res?.results.map((item) => item.id)!;
};

const getAllClientID = async () => {
  const res = await queryDB(notion, clientProfileDatabaseId, {
    property: 'isTaskCreated',
    checkbox: {
      equals: false,
    },
  });
  return res?.results.map((item) => item.id)!;
};

export const handler = async (event: any) => {
  const clientIdList = await getAllClientID();
  const taskIdList = await getAllTaskID();

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
