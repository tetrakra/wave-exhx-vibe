require('./server')(todos);

module.exports = (app) => {
    app.get('/api/todos', (req, res) => {
        try {
          res.status(200).json(todos);
        } catch (error) {
          console.error('Failed to get todos', error);
        }
      });
}

