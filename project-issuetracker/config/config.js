'use strict'
const path = require('path');

module.exports.getConfig = () => {
    const config = {
        'MODE': 'Development',
        'PORT': process.env.PORT || 3000,
        'MONGO_URI': process.env.MONGO_URI,
        'UPLOAD_PATH': path.resolve( `${__dirname }/../uploads` ),
        'JWT_SECRET': process.env.JWT_SECRET || 'R4ND0M5TR1NG'
    };

    // Modify for Production
    if ( process.env.NODE_ENV === 'production' ) {
        config.MODE = 'Production';
    }

    return config;
};