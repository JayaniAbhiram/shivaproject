const { getApp } = require('./app');

const PORT = process.env.PORT || 5001;

getApp()
  .then((app) => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
