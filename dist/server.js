// backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
app.listen(4444, () => {
    console.log('Server is running on port 4444');
});
//# sourceMappingURL=server.js.map