import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const getProductsList: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult>  => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			event,
			message: 'Hello, welcome to the exciting Serverless world!'
		}),
	};
  };