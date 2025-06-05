const VideoAdsModel = require('../model/video_ads_model');

exports.createVideoAd = async (req, res) => {
  try {
    const { ad_url, video_time, skip_time,title } = req.body;
    const ad_video = req.file ? `/uploads/${req.file.filename}` : null;

    const newAd = await VideoAdsModel.create({
      ad_video,
      ad_url,
      video_time,
      skip_time,
      title,
    });

    res.status(201).json({ status: true, message: 'Video Ad created successfully', data: newAd });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
};

exports.getAllVideoAds = async (req, reply) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await VideoAdsModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    reply.send({
      status: true,
      message: 'Video ads fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    });
  } catch (error) {
    reply.status(500).send({ status: false, message: 'Server error', error: error.message });
  }
};


exports.getVideoAdById = async (req, reply) => {
  try {
    const { id } = req.params;
    const ad = await VideoAdsModel.findByPk(id);

    if (!ad) {
      return reply.status(404).send({ status: false, message: 'Video ad not found' });
    }

    reply.send({ status: true, message: 'Video ad fetched successfully', data: ad });
  } catch (error) {
    reply.status(500).send({ status: false, message: 'Server error', error: error.message });
  }
};

exports.updateVideoAd = async (req, res) => {
  try {
    const ad = await VideoAdsModel.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ status: false, message: 'Ad not found' });

    const {ad_url, video_time, skip_time,title } = req.body;
    const ad_video = req.file ? `/uploads/${req.file.filename}` : ad.ad_video;

    await ad.update({
      ad_video,
      ad_url,
      video_time,
      skip_time,
      title,
    });

    res.json({ status: true, message: 'Ad updated successfully', data: ad });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.deleteVideoAd = async (req, reply) => {
  try {
    const { id } = req.params;
    const deleted = await VideoAdsModel.destroy({ where: { id } });

    if (!deleted) {
      return reply.status(404).send({ status: false, message: 'Video ad not found' });
    }

    reply.send({ status: true, message: 'Video ad deleted successfully' });

  } catch (error) {
    reply.status(500).send({ status: false, message: 'Server error', error: error.message });
  }
};
