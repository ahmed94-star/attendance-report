
function processFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // قراءة البيانات من الورقة الأولى
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // تحويل البيانات إلى JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // عرض البيانات في صفحة HTML
        document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);

        // إضافة زر لتحميل تقرير PDF
        const downloadButton = document.createElement('button');
        downloadButton.textContent = "Download PDF Report";
        downloadButton.onclick = () => generatePDF(jsonData);
        document.getElementById('pdf-button-container').appendChild(downloadButton);
    };

    // قراءة الملف كـ binary string
    reader.readAsBinaryString(file);
}

// دالة لتوليد تقرير PDF
function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // إعدادات التقرير: العنوان
    doc.setFontSize(18);
    doc.text('Attendance Report', 20, 20);
    
    // العنوان الفرعي: الشهر واسم الموظف وكود الموظف
    doc.setFontSize(14);
    const startDate = data[0].Date;  // نأخذ أول تاريخ من البيانات كمرجع
    doc.text(`Month: ${startDate}`, 20, 30);
    
    // أضف بيانات الموظف
    let yPos = 40;
    data.forEach(item => {
        doc.setFontSize(12);
        doc.text(`Employee: ${item.Name}`, 20, yPos);
        doc.text(`Employee Code: ${item.Code}`, 100, yPos);
        yPos += 10;
        doc.text(`Date: ${item.Date}`, 20, yPos);
        doc.text(`Check-in: ${item.CheckIn}`, 100, yPos);
        doc.text(`Check-out: ${item.CheckOut}`, 160, yPos);
        doc.text(`Work Hours: ${item.WorkHours}`, 220, yPos);
        yPos += 15;
    });
    
    // تحميل التقرير كملف PDF
    doc.save('attendance_report.pdf');
}
