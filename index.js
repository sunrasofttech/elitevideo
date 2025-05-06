const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/db');
const path = require('path');
const app = express();

const userRoutes = require('./routes/user_route');
const movieLanguageRoute = require('./routes/movie_language_route');
const adminRoute = require('./routes/admin_route');
const genreRoute = require('./routes/genre_route');
const AdminSettingRoute = require('./routes/admin_setting_route');
const MusicCategoryRoute = require('./routes/music_category_route');
const MovieCategoryRoute = require('./routes/movie_category_route');
const MovieRoute = require('./routes/movie_route');
const CastCrewRoute = require('./routes/cast_crew_route');
const MovieRatingRoute = require('./routes/movie_rating_route');

const baseUrl = '/api/ott';
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(`${baseUrl}/user`,userRoutes);
app.use(`${baseUrl}/movie-language`,movieLanguageRoute);
app.use(`${baseUrl}/admin`,adminRoute);
app.use(`${baseUrl}/genre`,genreRoute);
app.use(`${baseUrl}/admin-setting`,AdminSettingRoute);
app.use(`${baseUrl}/music-category`,MusicCategoryRoute);
app.use(`${baseUrl}/movie-category`,MovieCategoryRoute);
app.use(`${baseUrl}/movie`,MovieRoute);
app.use(`${baseUrl}/movie/cast-crew`,CastCrewRoute);
app.use(`${baseUrl}/movie-rating`,MovieRatingRoute);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch(err => console.error('Database connection error:', err));
