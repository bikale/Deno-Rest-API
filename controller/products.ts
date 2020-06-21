import { Client } from "https://deno.land/x/postgres/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Product } from "../types.ts";
import { dbCreds } from "../config.ts";
// import {dbCreds} from '../config.ts'

//connecting to postrges db
// const client = new Client(dbCreds)

const client = new Client({
  user: "bk",
  database: "denoapi",
  password: "12345",
  hostname: "localhost",
  port: 5432,
});

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = async ({ response }: { response: any }) => {
  // response.body = { success: true, data: products };

  try {
    await client.connect();
    const result = await client.query("SELECT * FROM products");
    // console.log(result);

    const products = new Array();

    result.rows.map((item) => {
      let rowObj: any = {};
      result.rowDescription.columns.map((elem, index) => {
        rowObj[elem.name] = item[index];
      });
      products.push(rowObj);
    });

    response.status = 200;
    response.body = {
      success: true,
      data: products,
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: error.toString(),
    };
  } finally {
    await client.end();
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM products WHERE id= $1",
      params.id
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        message: `No product with the id of ${params.id}`,
      };
      return;
    } else {
      const product: any = new Object();

      result.rows.map((p) => {
        result.rowDescription.columns.map((el, i) => {
          product[el.name] = p[i];
        });
      });

      response.body = {
        success: true,
        data: product,
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: error.toString(),
    };
  } finally {
    await client.end();
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
  if (request.hasBody) {
    const body = await request.body();
    const product: Product = body.value;

    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO products (name,description,price) VALUES($1,$2,$3)",
        product.name,
        product.description,
        product.price
      );

      // product.id = v4.generate();
      // products.push(product);

      response.status = 201;
      response.body = {
        success: true,
        data: product,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString(),
      };
    } finally {
      await client.end();
    }
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
const updateProduct = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  await getProduct({ params: { id: params.id }, response });

  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      message: response.body.message,
    };
    return;
  } else {
    if (request.hasBody) {
      const body = await request.body();
      const product: Product = body.value;

      try {
        await client.connect();
        const result = await client.query(
          "update products SET name=$1,description=$2,price=$3 WHERE id=$4",
          product.name,
          product.description,
          product.price,
          params.id
        );

        // product.id = v4.generate();
        // products.push(product);

        response.status = 200;
        response.body = {
          success: true,
          data: product,
        };
      } catch (err) {
        response.status = 500;
        response.body = {
          success: false,
          message: err.toString(),
        };
      } finally {
        await client.end();
      }
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "no data",
      };
    }
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  await getProduct({ params: { id: params.id }, response });

  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      message: response.body.message,
    };
    return;
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "DELETE FROM products WHERE id=$1",
        params.id
      );
      response.status = 204;
      response.body = {
        success: "true",
        message: `Product with id ${params.id} has been deleted`,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
