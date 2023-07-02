const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 3001;

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const userRoute = require('./routes/user.routes')
app.use('/user', userRoute)

const employeeRoute = require('./routes/employee.routes')
app.use('/employee', employeeRoute)

const productRoute = require('./routes/product.routes')
app.use('/product', productRoute)

const inventoryRoute = require('./routes/inventory.routes')
app.use('/inventory', inventoryRoute)

const orderRoute = require('./routes/order.routes')
app.use('/order', orderRoute)

const dashboardRoute = require('./routes/dashboard.routes')
app.use('/dashboard', dashboardRoute)

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



