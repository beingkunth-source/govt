/* ==========================================================================
   SHIKSHA SETU - BACKEND + FRONTEND SERVER
   Node.js + Express + PostgreSQL
   ========================================================================== */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const studentsRoutes = require('./routes/students.routes');
const teachersRoutes = require('./routes/teachers.routes');
const progressRoutes = require('./routes/progress.routes');
const quizzesRoutes = require('./routes/quizzes.routes');
const badgesRoutes = require('./routes/badges.routes');
const libraryRoutes = require('./routes/library.routes');
const syncRoutes = require('./routes/sync.routes');

const {
  errorHandler
} = require('./middleware/error.middleware');

const app = express();

const PORT =
  process.env.PORT || 5000;


/* ==========================================================================
   CORS CONFIGURATION
   ========================================================================== */

const allowedOrigins = [

  'http://localhost:5000',
  'http://127.0.0.1:5000',

  'http://localhost:5500',
  'http://127.0.0.1:5500',

  'http://localhost:3000',
  'http://127.0.0.1:3000',

  'http://localhost:5173',
  'http://127.0.0.1:5173'

];


app.use(
  cors({

    origin: function (origin, callback) {

      // Allow requests without Origin header
      if (!origin) {
        return callback(null, true);
      }

      // Allow local development
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      // Allow configured production frontend
      if (
        process.env.ALLOWED_ORIGIN &&
        origin === process.env.ALLOWED_ORIGIN
      ) {
        return callback(null, true);
      }

      // Allow predefined origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error('Not allowed by CORS')
      );
    },

    methods: [
      'GET',
      'POST',
      'PATCH',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: true

  })
);


/* ==========================================================================
   BODY PARSER
   ========================================================================== */

app.use(
  express.json({
    limit: '2mb'
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);


/* ==========================================================================
   AUTH RATE LIMITER
   ========================================================================== */

const authLimiter =
  rateLimit({

    windowMs:
      parseInt(
        process.env.RATE_LIMIT_WINDOW_MS ||
        '900000'
      ),

    max:
      parseInt(
        process.env.RATE_LIMIT_MAX ||
        '100'
      ),

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      error:
        'Too many requests. Please wait a few minutes and try again.'
    }

  });


/* ==========================================================================
   API ROUTES
   ========================================================================== */

app.use(
  '/api/v1/auth',
  authLimiter,
  authRoutes
);

app.use(
  '/api/v1/students',
  studentsRoutes
);

app.use(
  '/api/v1/teachers',
  teachersRoutes
);

app.use(
  '/api/v1/progress',
  progressRoutes
);

app.use(
  '/api/v1/quizzes',
  quizzesRoutes
);

app.use(
  '/api/v1/badges',
  badgesRoutes
);

app.use(
  '/api/v1/library',
  libraryRoutes
);

app.use(
  '/api/v1/sync',
  syncRoutes
);


/* ==========================================================================
   API ROOT
   ========================================================================== */

app.get(
  '/api/v1',
  (req, res) => {

    res.json({

      status: 'ok',

      platform:
        'Shiksha Setu',

      message:
        'Shiksha Setu API is running.',

      version:
        'v1'

    });

  }
);


/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

app.get(
  '/api/v1/health',
  (req, res) => {

    res.json({

      status: 'ok',

      platform:
        'Shiksha Setu',

      timestamp:
        new Date().toISOString()

    });

  }
);


/* ==========================================================================
   FRONTEND
   ========================================================================== */

/*
 * server.js is inside:
 *
 * project/backend/server.js
 *
 * index.html is inside:
 *
 * project/index.html
 *
 * Therefore ".." points to the project folder.
 */

const frontendPath =
  path.join(__dirname, '..');


/*
 * Serve frontend files:
 *
 * /index.html
 * /css/*
 * /js/*
 * /sw.js
 */

app.use(
  express.static(frontendPath)
);


/*
 * Main frontend page
 */

app.get(
  '/',
  (req, res) => {

    res.sendFile(
      path.join(
        frontendPath,
        'index.html'
      )
    );

  }
);


/*
 * Support your hash-based frontend routes.
 *
 * Examples:
 *
 * http://localhost:5000/#login
 * http://localhost:5000/#dashboard
 * http://localhost:5000/#quizzes
 * http://localhost:5000/#progress
 *
 * The browser handles everything after #.
 */


/* ==========================================================================
   404 HANDLER
   ========================================================================== */

app.use(
  (req, res) => {

    /*
     * API requests should return JSON 404.
     */

    if (
      req.originalUrl.startsWith(
        '/api/'
      )
    ) {

      return res
        .status(404)
        .json({

          error:
            'Endpoint not found.',

          method:
            req.method,

          path:
            req.originalUrl

        });

    }


    /*
     * Unknown frontend route:
     * return index.html.
     */

    return res.sendFile(
      path.join(
        frontendPath,
        'index.html'
      )
    );

  }
);


/* ==========================================================================
   GLOBAL ERROR HANDLER
   ========================================================================== */

app.use(
  errorHandler
);


/* ==========================================================================
   START SERVER
   ========================================================================== */

app.listen(
  PORT,
  () => {

    console.log('');
    console.log(
      '=========================================='
    );

    console.log(
      '🏛️  SHIKSHA SETU'
    );

    console.log(
      '=========================================='
    );

    console.log(
      `🌐 Website: http://localhost:${PORT}`
    );

    console.log(
      `📡 API: http://localhost:${PORT}/api/v1`
    );

    console.log(
      `❤️  Health: http://localhost:${PORT}/api/v1/health`
    );

    console.log(
      `🌿 Environment: ${process.env.NODE_ENV || 'development'}`
    );

    console.log(
      '=========================================='
    );

    console.log('');

  }
);


module.exports = app;