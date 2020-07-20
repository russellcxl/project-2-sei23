# Haste
## Streamlining the order/delivery process for your company's needs

This is will be a delivery system that processes orders and maps out the most efficient delivery path for the day. 

### Motivation
Some friends own a small business selling gaming chairs. However, because there is no proper order/delivery system, they do things very manually (and inefficiently) i.e. filter the order entries according to the day's date, write all the delivery addresses on a piece of paper, map their route, and go about the deliveries.

This app hopes to automate that process, supposing there is some way to retrieve a JSON file with all the orders from Shopify and link this API so that it makes a request for data every X hours.

### MVP
A system that lets you:
1. Log in as admin
2. View orders
3. Update orders

### Further
1. Sort orders by postal code
2. Map a delivery route for current day's orders

### Further
1. Retrieve orders from Shopify database

### Further
1. Include Google Map for visualising delivery route

### How the main page should look:
![wireframe](public/images/wireframe.PNG)

### Data-storage:
```js
User = {
    name
    email
    password
}

Order = {
    customer name
    products + qty
    status
    delivery date
}

Customer = {
    name
    phone
    address
    postal
}
```


