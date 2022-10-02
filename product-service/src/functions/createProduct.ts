import Ajv from 'ajv';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HttpResponse } from '@/utils/httpResponse';
import { StatusCode } from '@/consts/statusCode';
import { ProductData, ProductProviderInterface } from '@/types/products';
import { CreateProductRequestSchema } from '@/schemes/createProductRequest';

const validate = new Ajv().compile(CreateProductRequestSchema);

export const createProduct =
  (productProvider: ProductProviderInterface) =>
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));

    let productData: ProductData;

    try {
      if (!event.body) {
        throw new Error();
      }
      productData = JSON.parse(event.body) as ProductData;

      const isValidData = validate(productData);

      if (!isValidData) {
        console.log('Product data is invalid ', JSON.stringify(validate.errors));
        throw new Error();
      }
    } catch (e) {
      return HttpResponse.createErrorResponse(StatusCode.BadRequest, 'Bad product data');
    }

    try {
      const product = await productProvider.createProduct(productData);
      console.log('Product created successfully: ', JSON.stringify(product));

      return HttpResponse.createSuccessResponse(product);
    } catch (e) {
      console.log('An error occured while creating the product', e);

      return HttpResponse.createErrorResponse(
        StatusCode.ServerError,
        'Error while creating the product'
      );
    }
  };
