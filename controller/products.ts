import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Product } from "../types.ts";
let products: Product[] = [
  {
    id: "1",
    name: "Product One",
    description: "This is product one",
    price: 29.99,
  },
  {
    id: "2",
    name: "Product Two",
    description: "This is product Two",
    price: 39.99,
  },
  {
    id: "3",
    name: "Product Three",
    description: "This is product Three",
    price: 59.99,
  },
];

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = ({ response }: { response: any }) => {
  response.body = { success: true, data: products };
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const product: Product | undefined = products.find(
    (item) => item.id === params.id
  );

  if (product) {
    response.status = 200;
    response.body = {
      success: true,
      data: product,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      message: "Product not found",
    };
  }
};

// @desc    Add product
// @route   POST /api/v1/products
const addProduct = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();

  if (request.hasBody) {
    const product: Product = body.value;
    product.id = v4.generate();
    products.push(product);
    response.status = 201;
    response.body = {
      success: true,
      data: product,
    };
  } else {
    response.status = 400;
    response.body = {
      success: false,
      message: "no data",
    };
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
const updateProduct = ({ response }: { response: any }) => {};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = ({ response }: { response: any }) => {};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };