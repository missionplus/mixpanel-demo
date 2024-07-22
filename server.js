const express = require('express');
const path = require('path');
const Mixpanel = require('mixpanel');

const app = express();
const port = 3000;

// Initialize MixPanel
const mixpanel = Mixpanel.init('YOUR_MIXPANEL_TOKEN');  // YOUR_MIXPANEL_TOKEN

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/credit-check', (req, res) => {
    const { userId, age } = req.body;

    if (age < 18) {
        mixpanel.track('Credit Check Completed', {
            distinct_id: userId,
            result: 'Fail',
            reason: 'Too Young',
            age: age
        });
        res.json({ status: 'Fail' });
    } else if (age > 65) {
        mixpanel.track('Credit Check Completed', {
            distinct_id: userId,
            result: 'Fail',
            reason: 'Too Old',
            age: age
        });
        res.json({ status: 'Fail' });
    } else {
        mixpanel.track('Credit Check Completed', {
            distinct_id: userId,
            result: 'Pass',
            age: age
        });
        res.json({ status: 'Pass' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
