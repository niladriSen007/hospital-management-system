/* export default class ProductService {
  public static readonly getMyProducts = ({
    offset,
    limit,
    textFilter,
  }: ProductQueryParams): Promise<Product[]> => {
    return request({
      url: ProductEndpoints.getMyProducts(),
      method: AxiosMethod.GET,
      params: {
        limit,
        offset,
      },
    });
  };

  public static readonly getProduct = (
    id: string | number,
  ): Promise<Product> => {
    return request({
      url: ProductEndpoints.getProduct(id),
      method: AxiosMethod.GET,
    });
  };

  public static readonly getProductsFromOrder = (
    token: string,
  ): Promise<Product[]> => {
    return request({
      url: ProductEndpoints.getProductsFromOrder(token),
      method: AxiosMethod.GET,
    });
  };
} */