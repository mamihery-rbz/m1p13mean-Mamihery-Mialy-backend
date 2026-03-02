# m1p13mean-Mamihery-Mialy-backend

This backend provides a set of REST endpoints for authentication (register/login) and for shopper operations such as browsing shops, products and managing orders.

## Shopper API Endpoints

- `GET /shopper/shops` : retrieve list of all boutiques.
- `GET /shopper/shops/:shopId/products` : get products belonging to a specific boutique.
- `GET /shopper/orders?userId=<id>` : list all orders created by a user (userId may also be sent in the request body or provided by an auth middleware).
- `POST /shopper/orders` : create a new empty order for a user. JSON body requires `userId`.

### Example Requests

```bash
# create order
curl -X POST http://localhost:5000/shopper/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"615abc123"}'
```
- `GET /shopper/orders/:orderId/details` : fetch details of a given order (ownership is optionally checked if userId supplied).
- `POST /shopper/orders/:orderId/details` : add a product to an order. JSON body should include `productId`, `quantity`, `price` and optionally `userId`.
- `PUT /shopper/orders/:orderId/details/:detailId` : modify an existing order detail (quantity, price, status, etc.). Accepts JSON body with fields to update plus optional `userId`.
- `DELETE /shopper/orders/:orderId/details/:detailId` : remove a detail line from an order (optionally include `userId`).

Responses are returned in JSON. Order totals are automatically recalculated when details change.


