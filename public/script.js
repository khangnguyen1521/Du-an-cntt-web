// Cấu hình API
const API_BASE_URL = 'http://localhost:5000/api/regions';

// Các elements DOM
const searchForm = document.getElementById('searchForm');
const tableBody = document.getElementById('tableBody');
const resultsCount = document.getElementById('resultsCount');
const loadingIndicator = document.getElementById('loadingIndicator');
const noResults = document.getElementById('noResults');
const clearBtn = document.getElementById('clearBtn');
const loadAllBtn = document.getElementById('loadAllBtn');

// Detail Modal
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close');

// Form Modal
const formModal = document.getElementById('formModal');
const formModalTitle = document.getElementById('formModalTitle');
const regionForm = document.getElementById('regionForm');
const closeFormModal = document.getElementById('closeFormModal');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const addNewBtn = document.getElementById('addNewBtn');

// Delete Modal
const deleteModal = document.getElementById('deleteModal');
const deleteItemName = document.getElementById('deleteItemName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');

// State
let currentData = [];
let editingRegionId = null;

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadAllRegions();
});

// Thiết lập các event listeners
function initEventListeners() {
    // Submit form tìm kiếm
    searchForm.addEventListener('submit', handleSearch);
    
    // Nút xóa form
    clearBtn.addEventListener('click', clearForm);
    
    // Nút tải tất cả
    loadAllBtn.addEventListener('click', loadAllRegions);
    
    // Nút thêm mới
    addNewBtn.addEventListener('click', showAddForm);
    
    // Form modal events
    regionForm.addEventListener('submit', handleFormSubmit);
    closeFormModal.addEventListener('click', closeFormModalDialog);
    cancelFormBtn.addEventListener('click', closeFormModalDialog);
    
    // Delete modal events
    confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
    cancelDeleteBtn.addEventListener('click', closeDeleteModalDialog);
    closeDeleteModal.addEventListener('click', closeDeleteModalDialog);
    
    // Đóng modal detail
    closeModal.addEventListener('click', closeModalDialog);
    
    // Đóng modal khi click outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalDialog();
        }
        if (event.target === formModal) {
            closeFormModalDialog();
        }
        if (event.target === deleteModal) {
            closeDeleteModalDialog();
        }
    });
}

// Xử lý tìm kiếm
async function handleSearch(event) {
    event.preventDefault();
    
    const searchParams = {
        name: document.getElementById('searchName').value.trim(),
        location: document.getElementById('searchLocation').value.trim(),
        cropType: document.getElementById('searchCropType').value.trim(),
        status: document.getElementById('searchStatus').value
    };
    
    // Loại bỏ các tham số trống
    const filteredParams = Object.entries(searchParams)
        .filter(([key, value]) => value !== '')
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    
    if (Object.keys(filteredParams).length === 0) {
        showNotification('Vui lòng nhập ít nhất một tiêu chí tìm kiếm!', 'warning');
        return;
    }
    
    await searchRegions(filteredParams);
}

// Gọi API tìm kiếm
async function searchRegions(params) {
    showLoading(true);
    
    try {
        let url = API_BASE_URL;
        
        // Nếu có tham số tìm kiếm, thêm vào URL
        if (Object.keys(params).length > 0) {
            const searchQuery = new URLSearchParams(params).toString();
            url += `/search?${searchQuery}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentData = Array.isArray(data) ? data : data.data || [];
        
        displayResults(currentData);
        showNotification(`Tìm thấy ${currentData.length} kết quả phù hợp!`, 'success');
        
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        showNotification('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!', 'error');
        displayResults([]);
    } finally {
        showLoading(false);
    }
}

// Tải tất cả regions
async function loadAllRegions() {
    showLoading(true);
    
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentData = Array.isArray(data) ? data : data.data || [];
        
        displayResults(currentData);
        showNotification(`Đã tải ${currentData.length} vùng trồng!`, 'success');
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        showNotification('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!', 'error');
        displayResults([]);
    } finally {
        showLoading(false);
    }
}

// Hiển thị kết quả
function displayResults(data) {
    // Cập nhật số lượng kết quả
    resultsCount.textContent = data.length;
    
    // Xóa nội dung bảng hiện tại
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Hiển thị từng dòng dữ liệu
    data.forEach((region, index) => {
        const row = createTableRow(region, index + 1);
        tableBody.appendChild(row);
    });
}

// Tạo một dòng trong bảng
function createTableRow(region, stt) {
    const row = document.createElement('tr');
    
    const createdDate = region.createdAt ? 
        new Date(region.createdAt).toLocaleDateString('vi-VN') : 
        'N/A';
    
    const statusClass = region.status === 'active' ? 'status-active' : 'status-inactive';
    const statusText = region.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
    
    row.innerHTML = `
        <td>${stt}</td>
        <td>${escapeHtml(region.name || 'N/A')}</td>
        <td>${escapeHtml(region.location || 'N/A')}</td>
        <td>${formatNumber(region.area)}</td>
        <td>${escapeHtml(region.cropType || 'N/A')}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>${createdDate}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-view" onclick="showDetails('${region._id}')">
                    <i class="fas fa-eye"></i> Xem
                </button>
                <button class="btn btn-edit" onclick="editRegion('${region._id}')">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-delete" onclick="deleteRegion('${region._id}', '${escapeHtml(region.name)}')">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Hiển thị chi tiết region
async function showDetails(regionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${regionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const region = await response.json();
        
        const createdDate = region.createdAt ? 
            new Date(region.createdAt).toLocaleString('vi-VN') : 
            'N/A';
        
        const updatedDate = region.updatedAt ? 
            new Date(region.updatedAt).toLocaleString('vi-VN') : 
            'N/A';
        
        const statusText = region.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
        
        modalBody.innerHTML = `
            <div class="modal-detail-item">
                <span class="modal-detail-label">ID:</span>
                <span class="modal-detail-value">${region._id}</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Tên vùng trồng:</span>
                <span class="modal-detail-value">${escapeHtml(region.name)}</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Địa điểm:</span>
                <span class="modal-detail-value">${escapeHtml(region.location)}</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Diện tích:</span>
                <span class="modal-detail-value">${formatNumber(region.area)} m²</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Loại cây trồng:</span>
                <span class="modal-detail-value">${escapeHtml(region.cropType)}</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Trạng thái:</span>
                <span class="modal-detail-value">
                    <span class="${region.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${statusText}
                    </span>
                </span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Ngày tạo:</span>
                <span class="modal-detail-value">${createdDate}</span>
            </div>
            <div class="modal-detail-item">
                <span class="modal-detail-label">Ngày cập nhật:</span>
                <span class="modal-detail-value">${updatedDate}</span>
            </div>
        `;
        
        modal.style.display = 'block';
        
    } catch (error) {
        console.error('Lỗi khi tải chi tiết:', error);
        showNotification('Có lỗi xảy ra khi tải chi tiết!', 'error');
    }
}

// Đóng modal
function closeModalDialog() {
    modal.style.display = 'none';
}

// Xóa form
function clearForm() {
    searchForm.reset();
    showNotification('Đã xóa form tìm kiếm!', 'info');
}

// Hiển thị/ẩn loading indicator
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    // Xóa các thông báo cũ
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove();">&times;</button>
    `;
    
    // CSS cho notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Màu sắc theo type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau 5 giây
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(number) {
    if (number == null) return 'N/A';
    return number.toLocaleString('vi-VN');
}

// =================== CRUD FUNCTIONS ===================

// Hiển thị form thêm mới
function showAddForm() {
    editingRegionId = null;
    formModalTitle.textContent = 'Thêm Vùng Trồng Mới';
    regionForm.reset();
    document.getElementById('regionId').value = '';
    formModal.style.display = 'block';
}

// Hiển thị form sửa
async function editRegion(regionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${regionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const region = await response.json();
        
        editingRegionId = regionId;
        formModalTitle.textContent = 'Sửa Vùng Trồng';
        
        // Điền dữ liệu vào form
        document.getElementById('regionId').value = region._id;
        document.getElementById('regionName').value = region.name;
        document.getElementById('regionLocation').value = region.location;
        document.getElementById('regionArea').value = region.area;
        document.getElementById('regionCropType').value = region.cropType;
        document.getElementById('regionStatus').value = region.status;
        
        formModal.style.display = 'block';
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu để sửa:', error);
        showNotification('Có lỗi xảy ra khi tải dữ liệu!', 'error');
    }
}

// Xử lý submit form
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(regionForm);
    const regionData = {
        name: formData.get('name'),
        location: formData.get('location'),
        area: parseInt(formData.get('area')),
        cropType: formData.get('cropType'),
        status: formData.get('status')
    };
    
    try {
        let response;
        
        if (editingRegionId) {
            // Cập nhật
            response = await fetch(`${API_BASE_URL}/${editingRegionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regionData)
            });
        } else {
            // Thêm mới
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regionData)
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        closeFormModalDialog();
        
        if (editingRegionId) {
            showNotification('Cập nhật vùng trồng thành công!', 'success');
        } else {
            showNotification('Thêm vùng trồng mới thành công!', 'success');
        }
        
        // Tải lại dữ liệu
        loadAllRegions();
        
    } catch (error) {
        console.error('Lỗi khi lưu:', error);
        showNotification('Có lỗi xảy ra khi lưu dữ liệu!', 'error');
    }
}

// Hiển thị xác nhận xóa
function deleteRegion(regionId, regionName) {
    editingRegionId = regionId;
    deleteItemName.textContent = regionName;
    deleteModal.style.display = 'block';
}

// Xử lý xác nhận xóa
async function handleDeleteConfirm() {
    try {
        const response = await fetch(`${API_BASE_URL}/${editingRegionId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        closeDeleteModalDialog();
        showNotification('Xóa vùng trồng thành công!', 'success');
        
        // Tải lại dữ liệu
        loadAllRegions();
        
    } catch (error) {
        console.error('Lỗi khi xóa:', error);
        showNotification('Có lỗi xảy ra khi xóa dữ liệu!', 'error');
    }
}

// Đóng form modal
function closeFormModalDialog() {
    formModal.style.display = 'none';
    editingRegionId = null;
    regionForm.reset();
}

// Đóng delete modal
function closeDeleteModalDialog() {
    deleteModal.style.display = 'none';
    editingRegionId = null;
}

// CSS cho animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;
document.head.appendChild(style); 