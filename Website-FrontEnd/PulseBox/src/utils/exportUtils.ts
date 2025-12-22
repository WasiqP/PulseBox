// Export utilities for PDF and Excel generation
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Student Report Interface
export interface StudentReportData {
  studentName: string;
  studentEmail: string;
  className: string;
  tasks: {
    taskName: string;
    taskType: string;
    score?: number;
    maxScore: number;
    percentage?: number;
    passed?: boolean;
    submittedAt: string;
  }[];
  attendance: {
    date: string;
    status: 'present' | 'late' | 'absent';
  }[];
  overallStats: {
    totalTasks: number;
    completedTasks: number;
    averageScore?: number;
    attendanceRate: number;
  };
}

// Export student report to PDF
export const exportStudentReportToPDF = (data: StudentReportData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Performance Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Student Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Student: ${data.studentName}`, 20, yPos);
  yPos += 7;
  doc.text(`Email: ${data.studentEmail}`, 20, yPos);
  yPos += 7;
  doc.text(`Class: ${data.className}`, 20, yPos);
  yPos += 7;
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 15;

  // Overall Stats
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Statistics', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Tasks: ${data.overallStats.totalTasks}`, 20, yPos);
  yPos += 7;
  doc.text(`Completed Tasks: ${data.overallStats.completedTasks}`, 20, yPos);
  yPos += 7;
  if (data.overallStats.averageScore !== undefined) {
    doc.text(`Average Score: ${data.overallStats.averageScore.toFixed(1)}%`, 20, yPos);
    yPos += 7;
  }
  doc.text(`Attendance Rate: ${data.overallStats.attendanceRate.toFixed(1)}%`, 20, yPos);
  yPos += 15;

  // Tasks Section
  if (data.tasks.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Task Performance', 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');

    data.tasks.forEach((task, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${task.taskName} (${task.taskType})`, 20, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      
      if (task.score !== undefined) {
        doc.text(`Score: ${task.score.toFixed(1)} / ${task.maxScore}`, 25, yPos);
        yPos += 7;
        if (task.percentage !== undefined) {
          doc.text(`Percentage: ${task.percentage.toFixed(1)}%`, 25, yPos);
          yPos += 7;
        }
        doc.text(`Status: ${task.passed ? 'Passed' : 'Failed'}`, 25, yPos);
        yPos += 7;
      } else {
        doc.text('Status: Pending Review', 25, yPos);
        yPos += 7;
      }
      doc.text(`Submitted: ${new Date(task.submittedAt).toLocaleDateString()}`, 25, yPos);
      yPos += 10;
    });
  }

  // Attendance Section
  if (data.attendance.length > 0) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Record', 20, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');

    // Table header
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 20, yPos);
    doc.text('Status', 100, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');

    data.attendance.slice(0, 20).forEach((record) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(new Date(record.date).toLocaleDateString(), 20, yPos);
      doc.text(record.status.charAt(0).toUpperCase() + record.status.slice(1), 100, yPos);
      yPos += 7;
    });

    if (data.attendance.length > 20) {
      doc.text(`... and ${data.attendance.length - 20} more records`, 20, yPos);
    }
  }

  // Save PDF
  doc.save(`${data.studentName}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export student report to Excel
export const exportStudentReportToExcel = (data: StudentReportData): void => {
  const workbook = XLSX.utils.book_new();

  // Student Info Sheet
  const infoData = [
    ['Student Performance Report'],
    [],
    ['Student Name', data.studentName],
    ['Email', data.studentEmail],
    ['Class', data.className],
    ['Report Generated', new Date().toLocaleDateString()],
    [],
    ['Overall Statistics'],
    ['Total Tasks', data.overallStats.totalTasks],
    ['Completed Tasks', data.overallStats.completedTasks],
    ['Average Score', data.overallStats.averageScore?.toFixed(1) + '%' || 'N/A'],
    ['Attendance Rate', data.overallStats.attendanceRate.toFixed(1) + '%'],
  ];
  const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
  XLSX.utils.book_append_sheet(workbook, infoSheet, 'Summary');

  // Tasks Sheet
  const tasksData = [
    ['Task Name', 'Type', 'Score', 'Max Score', 'Percentage', 'Status', 'Submitted Date'],
    ...data.tasks.map(task => [
      task.taskName,
      task.taskType,
      task.score?.toFixed(1) || 'N/A',
      task.maxScore,
      task.percentage?.toFixed(1) + '%' || 'N/A',
      task.passed !== undefined ? (task.passed ? 'Passed' : 'Failed') : 'Pending',
      new Date(task.submittedAt).toLocaleDateString(),
    ]),
  ];
  const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData);
  XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');

  // Attendance Sheet
  const attendanceData = [
    ['Date', 'Status'],
    ...data.attendance.map(record => [
      new Date(record.date).toLocaleDateString(),
      record.status.charAt(0).toUpperCase() + record.status.slice(1),
    ]),
  ];
  const attendanceSheet = XLSX.utils.aoa_to_sheet(attendanceData);
  XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance');

  // Save Excel file
  XLSX.writeFile(workbook, `${data.studentName}_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export responses to CSV
export const exportResponsesToCSV = (responses: any[], taskName?: string, getTaskById?: (id: string) => any): void => {
  if (responses.length === 0) {
    alert('No responses to export');
    return;
  }

  const headers = ['Student Name', 'Student Email', 'Task Name', 'Task Type', 'Score', 'Max Score', 'Percentage', 'Status', 'Submitted At', 'Time Spent'];
  const rows = responses.map(response => {
    const task = getTaskById ? getTaskById(response.taskId) : null;
    const maxScore = task?.markingCriteria?.totalMarks || 'N/A';
    
    return [
      response.studentInfo?.name || 'Public',
      response.studentInfo?.email || 'N/A',
      response.taskName,
      response.taskType,
      response.score?.toFixed(1) || 'N/A',
      maxScore,
      response.percentage?.toFixed(1) + '%' || 'N/A',
      response.passed !== undefined ? (response.passed ? 'Passed' : 'Failed') : 'Pending',
      new Date(response.submittedAt).toLocaleString(),
      response.timeSpent ? `${Math.floor(response.timeSpent / 60)}m ${response.timeSpent % 60}s` : 'N/A',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${taskName || 'Responses'}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export responses to Excel
export const exportResponsesToExcel = (responses: any[], taskName?: string, getTaskById?: (id: string) => any): void => {
  if (responses.length === 0) {
    alert('No responses to export');
    return;
  }

  const data = [
    ['Student Name', 'Student Email', 'Task Name', 'Task Type', 'Score', 'Max Score', 'Percentage', 'Status', 'Submitted At', 'Time Spent'],
    ...responses.map(response => {
      const task = getTaskById ? getTaskById(response.taskId) : null;
      const maxScore = task?.markingCriteria?.totalMarks || 'N/A';
      
      return [
        response.studentInfo?.name || 'Public',
        response.studentInfo?.email || 'N/A',
        response.taskName,
        response.taskType,
        response.score?.toFixed(1) || 'N/A',
        maxScore,
        response.percentage?.toFixed(1) + '%' || 'N/A',
        response.passed !== undefined ? (response.passed ? 'Passed' : 'Failed') : 'Pending',
        new Date(response.submittedAt).toLocaleString(),
        response.timeSpent ? `${Math.floor(response.timeSpent / 60)}m ${response.timeSpent % 60}s` : 'N/A',
      ];
    }),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
  XLSX.writeFile(workbook, `${taskName || 'Responses'}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export class analytics to PDF
export const exportClassAnalyticsToPDF = (className: string, analytics: any): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Class Analytics: ${className}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 15;

  // Add analytics data here
  doc.text('Analytics data will be displayed here', 20, yPos);

  doc.save(`${className}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
};

