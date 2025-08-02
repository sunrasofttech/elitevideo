const AdminSetting = require('../model/admin_setting_model');

exports.getAdminSetting = async (req, res) => {
  try {
    const setting = await AdminSetting.findOne();
    if (!setting) return res.status(404).json({ status: false, message: 'No settings found' });
    res.status(200).json({ status: true, message: "Get admin setting successfully.", setting });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.createOrUpdateAdminSetting = async (req, res) => {
  try {
    const existingSetting = await AdminSetting.findOne();

     const logoPath = req.files['logo'] ? req.files['logo'][0].location : null;
    const spash_screen_banner_1 = req.files['spash_screen_banner_1'] ? req.files['spash_screen_banner_1'][0].location : null;
    const spash_screen_banner_2 = req.files['spash_screen_banner_2'] ? req.files['spash_screen_banner_2'][0].location : null;
    const spash_screen_banner_3 = req.files['spash_screen_banner_3'] ? req.files['spash_screen_banner_3'][0].location : null;


    const data = {
      ...req.body,
     app_logo: logoPath || existingSetting?.app_logo || null,
      spash_screen_banner_1: spash_screen_banner_1 || existingSetting?.spash_screen_banner_1 || null,
      spash_screen_banner_2: spash_screen_banner_2 || existingSetting?.spash_screen_banner_2 || null,
      spash_screen_banner_3: spash_screen_banner_3 || existingSetting?.spash_screen_banner_3 || null,
    };

    let setting;
    if (existingSetting) {
      await existingSetting.update(data);
      setting = existingSetting;
    } else {
      setting = await AdminSetting.create(data);
    }

    res.status(200).json({ status: true, message: 'Admin setting saved', setting });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteAdminSetting = async (req, res) => {
  try {
    const setting = await AdminSetting.findOne();
    if (!setting) return res.status(404).json({ status: false, message: 'Setting not found' });

    await setting.destroy();
    res.status(200).json({ status: true, message: 'Admin setting deleted' });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
