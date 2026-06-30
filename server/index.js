require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const talentRoutes = require('./routes/talentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const path = require('path');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// anyone who knows the filename can download any submission file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/', (req, res) => res.send('Task Pipeline API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
