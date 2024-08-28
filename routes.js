
//const routerProducts = require('./components/products/route.js')
const routerClicks = require('./components/clicks/route.js')

function routes(app) {
	
    
    //app.use('/products', routerProducts)
    app.use('/clicks', routerClicks)
   

	
}

module.exports = routes