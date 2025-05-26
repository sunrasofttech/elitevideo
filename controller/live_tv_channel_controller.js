const LiveTvChannel = require('../model/live_tv_channel_model');
const LiveTvChannelAdsModel = require('../model/livetv_channel_ads_model');
const LiveTvChannelModel = require('../model/live_tv_channel_model');
const VideoAdsModel = require('../model/video_ads_model');
const { Op } = require('sequelize');

// ✅ Create Channel
exports.createChannel = async (req, res) => {
  try {
    const { name, live_category_id, android_channel_url, ios_channel_url, description, status } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.path || null;
    const poster_img = req.files?.poster_img?.[0]?.path || null;

    const newChannel = await LiveTvChannel.create({
      name,
      live_category_id,
      android_channel_url,
      ios_channel_url,
      description,
      status,
      cover_img,
      poster_img
    });

    res.json({
      status: true,
      message: 'Channel created successfully',
      data: newChannel
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to create channel',
      data: err.message
    });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
      const { name, live_category_id } = req.query; 

        const whereClause = {};

        if (name) {
            whereClause.name = {
                [Op.like]: `%${name}%`
            };
        }

        if (live_category_id) {
            whereClause.live_category_id = live_category_id;
        }

    const { count, rows } = await LiveTvChannel.findAndCountAll({
      where:whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const enrichedChannels = await Promise.all(
      rows.map(async (channel) => {
        const channelJson = channel.toJSON();

        const channelAds = await LiveTvChannelAdsModel.findAll({
          where: { livetv_channel_id: channel.id },
          include: [
            { model: LiveTvChannelModel, as: 'livetv_channel' },
            { model: VideoAdsModel, as: 'video_ad' },
          ],
        });

        channelJson.channel_ads = channelAds;
        return channelJson;
      })
    );

    res.json({
      status: true,
      message: 'Fetched channels successfully',
      data: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        channels: enrichedChannels,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch channels',
      data: err.message,
    });
  }
};


// ✅ Get Single Channel
exports.getChannelById = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await LiveTvChannel.findByPk(id);

    if (!channel) {
      return res.status(404).json({
        status: false,
        message: 'Channel not found',
        data: null
      });
    }

    res.json({
      status: true,
      message: 'Fetched channel successfully',
      data: channel
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch channel',
      data: err.message
    });
  }
};

// ✅ Update Channel
exports.updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const cover_img = req.files?.cover_img?.[0]?.path;
    const poster_img = req.files?.poster_img?.[0]?.path;

    const updateData = {
      ...req.body,
      ...(cover_img && { cover_img }),
      ...(poster_img && { poster_img })
    };

    const [updated] = await LiveTvChannel.update(updateData, {
      where: { id }
    });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Channel not found',
        data: null
      });
    }

    const updatedChannel = await LiveTvChannel.findByPk(id);

    res.json({
      status: true,
      message: 'Channel updated successfully',
      data: updatedChannel
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to update channel',
      data: err.message
    });
  }
};

// ✅ Delete Channel
exports.deleteChannel = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No IDs provided for deletion',
        data: null,
      });
    }

    const deleted = await LiveTvChannel.destroy({
      where: { id: ids },
    });

    if (deleted === 0) {
      return res.status(404).json({
        status: false,
        message: 'No matching channels found to delete',
        data: null,
      });
    }

    res.json({
      status: true,
      message: `Deleted ${deleted} channel(s) successfully`
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete channels',
      data: err.message,
    });
  }
};
