const ShortfilmAdsModel = require('../model/shortfilm_ads_model');
const ShortfilmModel = require('../model/short_film_model');
const VideoAdsModel = require('../model/video_ads_model');

exports.createShortfilmAd = async (req, res) => {
  try {
    const shortfilmAd = await ShortfilmAdsModel.create(req.body);
    res.json({ status: true, message: 'Shortfilm Ad created successfully', data: shortfilmAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};


exports.getAllShortfilmAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await ShortfilmAdsModel.findAndCountAll({
      include: [
        { model: ShortfilmModel, as: 'shortfilm' },
        { model: VideoAdsModel, as: 'video_ad' }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      status: true,
      message: 'Shortfilm Ads fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};

exports.getShortfilmAdById = async (req, res) => {
  try {
    const shortfilmAd = await ShortfilmAdsModel.findByPk(req.params.id, {
      include: [
        { model: ShortfilmModel, as: 'shortfilm' },
        { model: VideoAdsModel, as: 'video_ad' }
      ]
    });
    if (!shortfilmAd) {
      return res.status(404).json({ status: false, message: 'Shortfilm Ad not found', data: null });
    }
    res.json({ status: true, message: 'Shortfilm Ad fetched successfully', data: shortfilmAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};

exports.updateShortfilmAd = async (req, res) => {
  try {
    const shortfilmAd = await ShortfilmAdsModel.findByPk(req.params.id);
    if (!shortfilmAd) {
      return res.status(404).json({ status: false, message: 'Shortfilm Ad not found', data: null });
    }
    await shortfilmAd.update(req.body);
    res.json({ status: true, message: 'Shortfilm Ad updated successfully', data: shortfilmAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};

exports.deleteShortfilmAd = async (req, res) => {
  try {
    const shortfilmAd = await ShortfilmAdsModel.findByPk(req.params.id);
    if (!shortfilmAd) {
      return res.status(404).json({ status: false, message: 'Shortfilm Ad not found', data: null });
    }
    await shortfilmAd.destroy();
    res.json({ status: true, message: 'Shortfilm Ad deleted successfully', data: null });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};
