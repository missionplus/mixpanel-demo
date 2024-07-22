document.addEventListener('DOMContentLoaded', function() {
    // Initialize MixPanel
    mixpanel.init("YOUR_MIXPANEL_TOKEN", {debug: true});

    // DOM elements
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const failScreen = document.getElementById('failScreen');
    const userIdInput = document.getElementById('userId');
    const ageInput = document.getElementById('age');
    const generateUUIDBtn = document.getElementById('generateUUID');
    const nextScreen1Btn = document.getElementById('nextScreen1');
    const nextScreen2Btn = document.getElementById('nextScreen2');

    // Generate UUID function
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Event listeners
    generateUUIDBtn.addEventListener('click', () => {
        userIdInput.value = generateUUID();
    });


    ageInput.addEventListener('change', () => {
        mixpanel.track('Age Entered', { 
            age: parseInt(ageInput.value)
        });
    });

    nextScreen1Btn.addEventListener('click', () => {
        const userId = userIdInput.value;
        
        if (!userId) {
            alert('Please enter a valid User ID');
            return;
        }
        mixpanel.identify(userId);
        mixpanel.track('Screen 1 Completed');

        screen1.style.display = 'none';
        screen2.style.display = 'block';
    });

    nextScreen2Btn.addEventListener('click', () => {
        const userId = userIdInput.value;
        const age = parseInt(ageInput.value);

        mixpanel.track('Credit Check Initiated', { age: age });

        fetch('/credit-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, age }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Pass') {
                screen2.style.display = 'none';
                screen3.style.display = 'block';
                mixpanel.track('Journey Completed');
            } else {
                screen2.style.display = 'none';
                failScreen.style.display = 'block';
                mixpanel.track('Application Failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mixpanel.track('Credit Check Error', { 
                error_message: error.toString()
            });
        });
    });
});
