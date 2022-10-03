import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { ImportServiceInterface } from '@/services/importService';

import { HttpResponse } from '@/utils';
import { StatusCode } from '@/consts';

export const importProductsFile =
  (importService: ImportServiceInterface): APIGatewayProxyHandler =>
  async (event: APIGatewayProxyEvent) => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));

    const { name: fileName } = event.queryStringParameters || {};

    if (!fileName) {
      return HttpResponse.createErrorResponse(StatusCode.BadRequest, 'Filename is not valid');
    }

    try {
      const uploadUrl = await importService.createUploadUrl(fileName);

      console.log('Upload url created successfully', uploadUrl);

      return HttpResponse.createSuccessResponse(uploadUrl);
    } catch (e) {
      console.log('An error occured while creating upload url', e);

      return HttpResponse.createErrorResponse(
        StatusCode.ServerError,
        'Failed to create upload url'
      );
    }
  };
