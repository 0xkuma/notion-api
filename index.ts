import { Client } from '@notionhq/client';
import { addItem, queryDB, queryItem } from './notion-controller';
import { logger } from './logger';
import * as dotenv from 'dotenv';
dotenv.config();

interface IClientAwsId {
  [key: string]: string;
}

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const taskDatabaseId = process.env.NOTION_TASK_DATABASE_ID!;
const masterListDatabaseId = process.env.NOTION_MASTER_LIST_DATABASE_ID!;
const clientProfileDatabaseId = process.env.NOTION_CLIENT_PROFILE_DATABASE_ID!;

// Compare two arrays and find the missing elements
const getMissingTaskId = (arr1: string[], arr2: string[]) => {
  const missing = arr1.filter((item) => !arr2.includes(item));
  return missing;
};

const getAllTaskId = async () => {
  const res = await queryDB(notion, masterListDatabaseId);
  return res?.results.map((item) => item.id)!;
};

const getAllClientId = async () => {
  const res = await queryDB(notion, clientProfileDatabaseId);
  let clientAwsIdList: IClientAwsId = {};
  for (let i = 0; i < res?.results.length!; i++) {
    const clientId = await queryItem(notion, res?.results[i].id!);
    if (clientId?.properties['AWS ID'].rich_text.length > 0) {
      clientAwsIdList[clientId?.properties['AWS ID'].rich_text[0].plain_text!] =
        res?.results[i].id!;
    }
    else {
      logger.error(`Client ${clientId?.properties['AWS Account Alias'].title[0].text.content} does not have AWS ID`);
    }
  }
  return clientAwsIdList;
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
  for (let i = 0; i < getAllTaskIdRes?.results.length!; i++) {
    const res = await queryItem(notion, getAllTaskIdRes?.results[i].id!);
    existTaskId.push(res?.properties['Task Full Name'].relation[0].id!);
  }
  return existTaskId;
};

export const handler = async (event: any) => {
  console.log('Start the notion api program...');
  const taskIdList = await getAllTaskId();
  const clientIdList = await getAllClientId();

  Object.entries(clientIdList).forEach(async ([key, value]) => {
    logger.info('Start to check the AWS ID: ' + key);
    const existTaskId = await getAllTaskIdCreatedByClientId(key);
    const missingTaskId = getMissingTaskId(taskIdList, existTaskId);
    if (missingTaskId.length > 0) {
      logger.info(
        `AWS ID: ${key}, Missing task id: [${missingTaskId}], Total: ${missingTaskId.length}`,
      );
      for (let i = 0; i < missingTaskId.length; i++) {
        await addItem(notion, taskDatabaseId, value, missingTaskId[i]);
      }
    }
    logger.info('Finish to check the AWS ID: ' + key);
  });
  console.log('Finish the notion api program...');
};
handler(null);
