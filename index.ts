require("dotenv").config();

export const server = require("./server");

const PORT = process.env.PORT || 5000;

if (!module.parent) {
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}
