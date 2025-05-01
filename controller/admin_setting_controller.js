const AdminSetting = require('../model/admin_setting_model');

exports.getAdminSetting = async (req, res) => {
  try {
    const setting = await AdminSetting.findOne();
    if (!setting) return res.status(404).json({status:false, message: 'No settings found' });
    res.status(200).json({status:true,message:"Get admin setting successfully.",setting});
  } catch (err) {
    res.status(500).json({status:false, message: err.message });
  }
};

exports.createOrUpdateAdminSetting = async (req, res) => {
  try {
    const existingSetting = await AdminSetting.findOne();

    const logoPath = req.file ? req.file.path : null;

    const data = {
      ...req.body,
      app_logo: logoPath || null,
    };

    let setting;
    if (existingSetting) {
      await existingSetting.update(data);
      setting = existingSetting;
    } else {
      setting = await AdminSetting.create(data);
    }

    res.status(200).json({status:true, message: 'Admin setting saved', setting });
  } catch (err) {
    res.status(500).json({status:false, message: err.message });
  }
};

exports.deleteAdminSetting = async (req, res) => {
  try {
    const setting = await AdminSetting.findOne();
    if (!setting) return res.status(404).json({status:false, message: 'Setting not found' });

    await setting.destroy();
    res.status(200).json({status:true, message: 'Admin setting deleted' });
  } catch (err) {
    res.status(500).json({status:false,  error: err.message });
  }
};
