import { Client, APIErrorCode, isNotionClientError, ClientErrorCode } from '@notionhq/client';

export const queryDB = async (notion: Client, databaseId: string, filter?: any) => {
  try {
    if (filter) {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: filter,
      });
      return response;
    } else {
      const response = await notion.databases.query({
        database_id: databaseId,
      });
      return response;
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.log('Request timed out');
          break;
        case APIErrorCode.ObjectNotFound:
          console.log('Object not found');
          break;
        case APIErrorCode.Unauthorized:
          console.log('Unauthorized');
          break;
        default:
          console.log('Unknown error');
      }
    }
  }
};

export const addItem = async (notion: Client, databaseId: string, client: string, task: string) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'MSP Task Unique ID': {
          title: [
            {
              text: {
                content: '123',
              },
            },
          ],
        },
        'AWS Alias': {
          relation: [
            {
              id: client,
            },
          ],
        },
        'Task Full Name': {
          relation: [
            {
              id: task,
            },
          ],
        },
      },
    });
    return response;
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.log('Request timed out');
          break;
        case APIErrorCode.ObjectNotFound:
          console.log('Object not found');
          break;
        case APIErrorCode.Unauthorized:
          console.log('Unauthorized');
          break;
        default:
          console.log('Unknown error');
      }
    }
  }
};

export const queryItem = async (notion: Client, pageId: string) => {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });
    return response as any;
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.log('Request timed out');
          break;
        case APIErrorCode.ObjectNotFound:
          console.log('Object not found');
          break;
        case APIErrorCode.Unauthorized:
          console.log('Unauthorized');
          break;
        default:
          console.log('Unknown error');
      }
    }
  }
};

export const updateItem = async (notion: Client, pageId: string, properties: any) => {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    return response;
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.log('Request timed out');
          break;
        case APIErrorCode.ObjectNotFound:
          console.log('Object not found');
          break;
        case APIErrorCode.Unauthorized:
          console.log('Unauthorized');
          break;
        default:
          console.log('Unknown error');
      }
    }
  }
};
