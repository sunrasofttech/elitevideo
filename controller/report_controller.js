const Movie = require('../model/movie_model');
const Series = require('../model/series_model');
const LiveChannel = require('../model/live_tv_channel_model');
const ReportModel = require('../model/report_model');

exports.reportContent = async (req, res) => {
    try {
      const { user_id, content_type, content_id,reason } = req.body;
  
      let model;
      if (content_type === 'movie') model = Movie;
      else if (content_type === 'series') model = Series;
      else if (content_type === 'live') model = LiveChannel;
      else {
        return res.status(400).json({
          status: false,
          message: 'Invalid content_type',
          data: null,
        });
      }
  
      const existingReport = await ReportModel.findOne({
        where: { user_id, content_id, content_type,reason }
      });
  
      if (existingReport) {
        return res.status(409).json({
          status: false,
          message: 'You have already reported this content.'
        });
      }
  
      const content = await model.findByPk(content_id);
      if (!content) {
        return res.status(404).json({
          status: false,
          message: 'Content not found'
        });
      }
  
      content.report_count += 1;
      await content.save();
  
      await ReportModel.create({ user_id, content_id, content_type,reason });
  
      return res.status(200).json({
        status: true,
        message: 'Report submitted successfully',
        data: content,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Something went wrong',
        data: error.message,
      });
    }
  };

  exports.getAllReports = async (req, res) => {
  try {
    const reports = await ReportModel.findAll();

    const detailedReports = await Promise.all(reports.map(async report => {
      let content = null;

      if (report.content_type === 'movie') {
        content = await Movie.findByPk(report.content_id);
      } else if (report.content_type === 'series') {
        content = await Series.findByPk(report.content_id);
      } else if (report.content_type === 'live') {
        content = await LiveChannel.findByPk(report.content_id);
      }

      return {
        ...report.toJSON(),
        content_details: content,
      };
    }));

    return res.status(200).json({
      status: true,
      message: 'All reports with content details fetched successfully',
      data: detailedReports,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};