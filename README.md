# Week 2: Express.js RESTful API

This project is a RESTful API built with Express.js for managing a collection of products. It implements standard CRUD operations, middleware for logging, authentication, and validation, and advanced features like filtering, pagination, and search.

## How to Run the Server

1.  **Install dependencies:**
    ```bash
    npm install express body-parser uuid
    ```
2.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will be running on `http://localhost:3000`.

## API Endpoints

### Authentication

For `POST`, `PUT`, and `DELETE` requests, you need to provide an API key in the `x-api-key` header. The API key is `your-secret-api-key`.

### Products

*   **`GET /api/products`**: List all products.
    *   **Query Parameters:**
        *   `category` (string, optional): Filter products by category.
        *   `page` (number, optional, default: 1): Page number for pagination.
        *   `limit` (number, optional, default: 10): Number of items per page.
    *   **Example Request:** `GET /api/products?category=electronics&page=1&limit=5`
    *   **Example Response:**
        ```json
        {
          "page": 1,
          "limit": 5,
          "total": 2,
          "data": [
            {
              "id": "1",
              "name": "Laptop",
              "description": "High-performance laptop with 16GB RAM",
              "price": 1200,
              "category": "electronics",
              "inStock": true
            },
            {
              "id": "2",
              "name": "Smartphone",
              "description": "Latest model with 128GB storage",
              "price": 800,
              "category": "electronics",
              "inStock": true
            }
          ]
        }
        ```

*   **`GET /api/products/search`**: Search for products by name.
    *   **Query Parameters:**
        *   `name` (string, required): The name of the product to search for.
    *   **Example Request:** `GET /api/products/search?name=Laptop`
    *   **Example Response:**
        ```json
        [
          {
            "id": "1",
            "name": "Laptop",
            "description": "High-performance laptop with 16GB RAM",
            "price": 1200,
            "category": "electronics",
            "inStock": true
          }
        ]
        ```

*   **`GET /api/products/stats`**: Get product statistics (count by category).
    *   **Example Request:** `GET /api/products/stats`
    *   **Example Response:**
        ```json
        {
          "electronics": 2,
          "kitchen": 1
        }
        ```

*   **`GET /api/products/:id`**: Get a specific product by ID.
    *   **Example Request:** `GET /api/products/1`
    *   **Example Response:**
        ```json
        {
          "id": "1",
          "name": "Laptop",
          "description": "High-performance laptop with 16GB RAM",
          "price": 1200,
          "category": "electronics",
          "inStock": true
        }
        ```

*   **`POST /api/products`**: Create a new product.
    *   **Request Body:**
        ```json
        {
          "name": "New Product",
          "description": "A brand new product",
          "price": 100,
          "category": "general",
          "inStock": true
        }
        ```
    *   **Example Response:**
        ```json
        {
          "id": "some-uuid",
          "name": "New Product",
          "description": "A brand new product",
          "price": 100,
          "category": "general",
          "inStock": true
        }
        ```

*   **`PUT /api/products/:id`**: Update an existing product.
    *   **Request Body:**
        ```json
        {
          "name": "Updated Product",
          "description": "An updated product",
          "price": 150,
          "category": "general",
          "inStock": false
        }
        ```
    *   **Example Response:**
        ```json
        {
          "id": "1",
          "name": "Updated Product",
          "description": "An updated product",
          "price": 150,
          "category": "general",
          "inStock": false
        }
        ```

*   **`DELETE /api/products/:id`**: Delete a product.
    *   **Example Request:** `DELETE /api/products/1`
    *   **Example Response:** `204 No Content`

## Environment Variables

This project uses environment variables to configure the server. Create a `.env` file in the root of the project and add the following variables:

```
PORT=3000
API_KEY=your-secret-api-key
```
