const Region = require('../models/Region');

// Tạo vùng trồng mới
exports.createRegion = async (req, res) => {
  try {
    const newRegion = new Region(req.body);
    const saved = await newRegion.save();
    res.status(201).json({ message: 'Tạo thành công', data: saved });
  } catch (err) {
    res.status(400).json({ message: 'Tạo thất bại', error: err.message });
  }
};

// Lấy tất cả vùng trồng
exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Tìm kiếm vùng trồng
exports.searchRegions = async (req, res) => {
  try {
    const { name, location, cropType, status } = req.query;
    
    // Xây dựng query object
    let searchQuery = {};
    
    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa/thường
    }
    
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }
    
    if (cropType) {
      searchQuery.cropType = { $regex: cropType, $options: 'i' };
    }
    
    if (status && status !== '') {
      searchQuery.status = status;
    }
    
    // Thực hiện tìm kiếm
    const regions = await Region.find(searchQuery).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: `Tìm thấy ${regions.length} kết quả`,
      count: regions.length,
      data: regions
    });
    
  } catch (err) {
    res.status(500).json({ 
      message: 'Lỗi khi tìm kiếm', 
      error: err.message 
    });
  }
};

// Lấy vùng trồng theo ID
exports.getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) return res.status(404).json({ message: 'Không tìm thấy vùng trồng' });
    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật vùng trồng
exports.updateRegion = async (req, res) => {
  try {
    const updated = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy vùng để cập nhật' });
    res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa vùng trồng
exports.deleteRegion = async (req, res) => {
  try {
    const deleted = await Region.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy vùng để xóa' });
    res.status(200).json({ message: 'Đã xóa vùng trồng', data: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};