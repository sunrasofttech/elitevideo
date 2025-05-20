const LiveTvChannelAdsModel = require('../model/livetv_channel_ads_model');
const LiveTvChannelModel = require('../model/live_tv_channel_model');
const VideoAdsModel = require('../model/video_ads_model');

exports.createLiveTvChannelAd = async (req, res) => {
  try {
    const { livetv_channel_id, video_ad_id } = req.body;
    const ad = await LiveTvChannelAdsModel.create({ livetv_channel_id, video_ad_id });

    res.status(201).json({
      status: true,
      message: 'Live TV Channel Ad created successfully',
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create Live TV Channel Ad',
      data: error,
    });
  }
};

exports.getAllLiveTvChannelAds = async (req, res) => {
  try {
    const ads = await LiveTvChannelAdsModel.findAll({
      include: [
        { model: LiveTvChannelModel, as: 'livetv_channel' },
        { model: VideoAdsModel, as: 'video_ad' },
      ],
    });

    res.status(200).json({
      status: true,
      message: 'Live TV Channel Ads fetched successfully',
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch Live TV Channel Ads',
      data: error,
    });
  }
};

exports.getLiveTvChannelAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await LiveTvChannelAdsModel.findByPk(id, {
      include: [
        { model: LiveTvChannelModel, as: 'livetv_channel' },
        { model: VideoAdsModel, as: 'video_ad' },
      ],
    });

    if (!ad) {
      return res.status(404).json({
        status: false,
        message: 'Live TV Channel Ad not found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Live TV Channel Ad fetched successfully',
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch Live TV Channel Ad',
      data: error,
    });
  }
};

exports.updateLiveTvChannelAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { livetv_channel_id, video_ad_id } = req.body;

    const ad = await LiveTvChannelAdsModel.findByPk(id);
    if (!ad) {
      return res.status(404).json({
        status: false,
        message: 'Live TV Channel Ad not found',
        data: null,
      });
    }

    ad.livetv_channel_id = livetv_channel_id || ad.livetv_channel_id;
    ad.video_ad_id = video_ad_id || ad.video_ad_id;

    await ad.save();

    res.status(200).json({
      status: true,
      message: 'Live TV Channel Ad updated successfully',
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update Live TV Channel Ad',
      data: error,
    });
  }
};

exports.deleteLiveTvChannelAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LiveTvChannelAdsModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Live TV Channel Ad not found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Live TV Channel Ad deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete Live TV Channel Ad',
      data: error,
    });
  }
};
