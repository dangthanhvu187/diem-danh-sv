let ketQuaDiemDanh = [];

async function diemDanh() {
    // Kiểm tra nếu đã điểm danh
    if (localStorage.getItem("daDiemDanh") === "true") {
        document.getElementById('ketqua').innerHTML = "Bạn đã điểm danh rồi, không thể điểm danh lại.";
        return;
    }

    const maSoNhap = document.getElementById('maSo').value.trim().toUpperCase();
    if (maSoNhap === "") {
        document.getElementById('ketqua').innerHTML = "Vui lòng nhập mã số của bạn.";
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (isValidLocation(lat, lon)) {
                const response = await fetch('danh_sach.json');
                const danhSach = await response.json();

                const nguoiDung = danhSach.find((nguoi) => nguoi.maSo.toUpperCase() === maSoNhap);
                if (nguoiDung) {
                    document.getElementById('ketqua').innerHTML = "Điểm danh thành công cho " + nguoiDung.ten + "!";

                    // Thêm vào kết quả điểm danh
                    ketQuaDiemDanh.push({
                        maSo: nguoiDung.maSo,
                        ten: nguoiDung.ten,
                        thoiGian: new Date().toLocaleString()
                    });

                    // Đánh dấu là đã điểm danh trong localStorage
                    localStorage.setItem("daDiemDanh", "true");
                } else {
                    document.getElementById('ketqua').innerHTML = "Mã số không có trong danh sách.";
                }
            } else {
                document.getElementById('ketqua').innerHTML = "Bạn không ở vị trí hợp lệ để điểm danh.";
            }
        });
    } else {
        document.getElementById('ketqua').innerHTML = "Trình duyệt không hỗ trợ xác định vị trí.";
    }
}

function isValidLocation(lat, lon) {
    const allowedLat = 10.830651631830856; 
    const allowedLon = 106.77545051419781;
    const radius = 2.0;

    const distance = Math.sqrt(Math.pow(lat - allowedLat, 2) + Math.pow(lon - allowedLon, 2));
    return distance <= radius;
}

function taiFileExcel() {
    const matKhauNhap = document.getElementById('matKhau').value.trim();
    const matKhauDung = "123456"; // Bạn có thể thay đổi mật khẩu theo ý muốn

    if (matKhauNhap !== matKhauDung) {
        alert("Mật khẩu không đúng!");
        return;
    }

    // Tạo workbook từ danh sách điểm danh
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ketQuaDiemDanh);
    XLSX.utils.book_append_sheet(wb, ws, "DiemDanh");

    // Xuất file Excel
    XLSX.writeFile(wb, 'KetQuaDiemDanh.xlsx');
}
