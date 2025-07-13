const app = require('./src/app')
const { config } = require('./src/utils/config');

const port = config.port || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
